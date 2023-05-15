import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { SyncTransactionRequest } from '@requests/sync-transaction.request';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { TransactionItemInterface } from '@schemas/interface/TransactionItem.Interface';
import { TransactionItem } from '@schemas/transaction-item.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { getTimezone } from '@utils/common';
import {
  DATE_FOMAT,
  DATE_FOMAT_EXCELL,
  FORMAT_DATE,
  TIMEZONE_HCM_CITY,
} from '@utils/constant';
import { keyBy } from 'lodash';
import { ActionType, ReportType } from '@enums/report-type.enum';
import {
  TRANSACTION_MOVEMENT_TYPE_IMPORT_EXPORT,
  WarehouseMovementTypeEnum,
} from '@enums/order-type.enum';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
@Injectable()
export class TransactionItemRepository extends BaseAbstractRepository<TransactionItem> {
  constructor(
    @InjectModel(TransactionItem.name)
    private readonly transactionItem: Model<TransactionItem>,
  ) {
    super(transactionItem);
  }

  async createOne(
    syncTransactionRequest: SyncTransactionRequest,
  ): Promise<void> {
    const document = new this.transactionItem();
    Object.assign(document, syncTransactionRequest);
    await document.save();
  }

  async saveMany(
    syncTransactionRequest: TransactionItemInterface[],
  ): Promise<any> {
    return this.transactionItem.create(syncTransactionRequest);
  }

  async updateQuantityItem(
    request: ReportRequest,
    data: DailyLotLocatorStock[] | DailyWarehouseItemStock[],
  ): Promise<any> {
    const curDate = getTimezone(undefined, FORMAT_DATE);
    if (curDate !== request.dateFrom || curDate !== request.dateTo) return data;
    switch (request.reportType) {
      case ReportType.INVENTORY:
        if (curDate === request.dateFrom || curDate === request.dateTo) {
          const dataTransactionByCurDate = await this.groupByItemLotLocator(
            request,
          );
          const keyByItem = data.reduce((prev, cur) => {
            const key = [
              cur.warehouseCode,
              cur.itemCode,
              cur.lotNumber,
              cur.locatorCode,
            ].join('-');
            if (!prev[key]) {
              prev[key] = cur;
            } else {
              prev[key].stockQuantity += cur.stockQuantity;
            }
            return prev;
          }, {} as any);

          dataTransactionByCurDate.forEach((item) => {
            let key = [
              item.warehouseCode,
              item.itemCode,
              item.lotNumber,
              item.locatorCode,
            ].join('-');

            if (keyByItem[key]) {
              const itemStock = keyByItem[key];
              itemStock.stockQuantity =
                itemStock.stockQuantity +
                item.quantityImported -
                item.quantityExported;
            } else {
              item['stockQuantity'] =
                item.quantityImported - item.quantityExported;
              if (item.quantityImported) keyByItem[key] = item;
            }
          });
          return Object.values(keyByItem);
        } else {
          return data;
        }
      case ReportType.ITEM_INVENTORY_BELOW_SAFE:
      case ReportType.ITEM_INVENTORY_BELOW_MINIMUM:
        if (curDate === request.dateFrom || curDate === request.dateTo) {
          const dataTransactionByCurDate = await this.groupByItemLot(request);

          const keyByItem = keyBy(data, function (o) {
            return [o.warehouseCode, o.itemCode].join('-');
          });

          dataTransactionByCurDate.forEach((item) => {
            let key = [item.warehouseCode, item.itemCode].join('-');
            if (keyByItem[key]) {
              const itemStock = keyByItem[key];
              itemStock.stockQuantity =
                itemStock.stockQuantity +
                item.quantityImported -
                item.quantityExported;
            }
          });
          Object.keys(keyByItem).forEach((key) => {
            const itemStock = keyByItem[key];
            switch (request?.reportType) {
              case ReportType.ITEM_INVENTORY_BELOW_SAFE:
                if (itemStock?.stockQuantity > itemStock?.inventoryLimit) {
                  delete keyByItem[key];
                }
                break;
              case ReportType.ITEM_INVENTORY_BELOW_MINIMUM:
                if (itemStock?.stockQuantity > itemStock?.minInventoryLimit) {
                  delete keyByItem[key];
                }
                break;
            }
          });
          return Object.values(keyByItem);
        } else {
          return data;
        }
    }
  }

  async groupByItemLot(request: ReportRequest) {
    const { reportType } = request;
    const condition = {
      $and: [],
      $or: [],
    };
    if (reportType === ReportType.ITEM_INVENTORY) {
      condition['$and'].push({
        movementType: { $in: TRANSACTION_MOVEMENT_TYPE_IMPORT_EXPORT },
      });
    }
    const curDate = getTimezone(undefined, FORMAT_DATE);

    condition['$and'].push({
      companyCode: { $eq: request?.companyCode },
    });

    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    if (request?.dateFrom) {
      condition['$and'].push({
        $expr: {
          $gte: [
            {
              $dateToString: {
                date: '$transactionDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    }

    if (request?.dateTo) {
      condition['$and'].push({
        $expr: {
          $lte: [
            {
              $dateToString: {
                date: '$transactionDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(request?.dateTo).format(DATE_FOMAT),
          ],
        },
      });
    }

    condition['$or'].push({
      $expr: {
        $lte: [
          {
            $dateToString: {
              date: '$transactionDate',
              format: '%Y-%m-%d',
              timezone: TIMEZONE_HCM_CITY,
            },
          },
          moment(curDate).format(DATE_FOMAT),
        ],
      },
    });
    return this.transactionItem.aggregate([
      { $match: condition },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          companyName: 1,
          companyAddress: 1,
          warehouseCode: 1,
          warehouseName: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          lotNumber: 1,
          storageCost: 1,
          quantityExported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.EXPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.IMPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityExportedCurDate: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$actionType', ActionType.EXPORT],
                  },
                  {
                    $eq: [
                      {
                        $dateToString: {
                          date: '$transactionDate',
                          format: '%Y-%m-%d',
                          timezone: TIMEZONE_HCM_CITY,
                        },
                      },
                      moment(curDate).format(DATE_FOMAT),
                    ],
                  },
                ],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImportedCurDate: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ['$actionType', ActionType.IMPORT],
                  },
                  {
                    $eq: [
                      {
                        $dateToString: {
                          date: '$transactionDate',
                          format: '%Y-%m-%d',
                          timezone: TIMEZONE_HCM_CITY,
                        },
                      },
                      moment(curDate).format(DATE_FOMAT),
                    ],
                  },
                ],
              },
              '$actualQuantity',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            companyName: '$companyName',
            companyAddress: '$companyAddress',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
            lotNumber: '$lotNumber',
            unit: '$unit',
          },
          quantityExported: { $sum: '$quantityExported' },
          quantityImported: { $sum: '$quantityImported' },
          quantityExportedCurDate: { $sum: '$quantityExportedCurDate' },
          quantityImportedCurDate: { $sum: '$quantityImportedCurDate' },
        },
      },
      {
        $lookup: {
          from: 'daily-item-warehouse-stock-price',
          let: {
            companyCodeMap: '$_id.companyCode',
            warehouseCodeMap: '$_id.warehouseCode',
            itemCodeMap: '$_id.itemCode',
            lotNumberMap: '$_id.lotNumber',
          },
          pipeline: [
            {
              $sort: { reportDate: -1 },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$companyCode', '$$companyCodeMap'] },
                    { $eq: ['$warehouseCode', '$$warehouseCodeMap'] },
                    { $eq: ['$itemCode', '$$itemCodeMap'] },
                    { $eq: ['$lotNumber', '$$lotNumberMap'] },
                  ],
                },
              },
            },
            {
              $project: {
                price: 1,
                quantity: 1,
                averagePrice: {
                  $cond: {
                    if: '$quantity',
                    then: {
                      $divide: ['$price', '$quantity'],
                    },
                    else: 0,
                  },
                },
              },
            },
          ],
          as: 'priceItem',
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          itemCode: '$_id.itemCode',
          itemName: '$_id.itemName',
          lotNumber: '$_id.lotNumber',
          storageCost: { $arrayElemAt: ['$priceItem.averagePrice', 0] },
          unit: '$_id.unit',
          quantityExported: 1,
          quantityImported: 1,
          quantityExportedCurDate: 1,
          quantityImportedCurDate: 1,
        },
      },
    ]);
  }

  async groupByItemLotLocator(request: ReportRequest) {
    const curDate = getTimezone(undefined, FORMAT_DATE);

    const condition = {
      $and: [],
    };

    condition['$and'].push({
      companyCode: { $eq: request?.companyCode },
    });

    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    if (request?.dateFrom) {
      condition['$and'].push({
        $expr: {
          $gte: [
            {
              $dateToString: {
                date: '$transactionDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(curDate).format(DATE_FOMAT),
          ],
        },
      });
    }

    return this.transactionItem.aggregate([
      { $match: condition },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          companyName: 1,
          companyAddress: 1,
          warehouseCode: 1,
          warehouseName: 1,
          itemCode: 1,
          itemName: 1,
          locatorCode: 1,
          unit: 1,
          lotNumber: 1,
          storageCost: 1,
          quantityExported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.EXPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImported: {
            $cond: [
              {
                $and: [{ $eq: ['$actionType', ActionType.IMPORT] }],
              },
              '$actualQuantity',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            companyName: '$companyName',
            companyAddress: '$companyAddress',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
            locatorCode: '$locatorCode',
            unit: '$unit',
            lotNumber: '$lotNumber',
            storageCost: '$storageCost',
            transactionDate: '$transactionDate',
          },
          quantityExported: { $sum: '$quantityExported' },
          quantityImported: { $sum: '$quantityImported' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          itemCode: '$_id.itemCode',
          itemName: '$_id.itemName',
          locatorCode: '$_id.locatorCode',
          unit: '$_id.unit',
          lotNumber: '$_id.lotNumber',
          storageCost: '$_id.storageCost',
          quantityExported: 1,
          quantityImported: 1,
          transactionDate: {
            $dateToString: {
              date: '$_id.transactionDate',
              format: '%m/%d/%Y',
              timezone: TIMEZONE_HCM_CITY,
            },
          },
        },
      },
    ]);
  }

  async getTransactionByDate(request: ReportRequest) {
    const condition = {
      $and: [],
    };

    condition['$and'].push({
      companyCode: { $eq: request?.companyCode },
    });

    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    if (request?.dateFrom) {
      request.dateFrom = getTimezone(request?.dateFrom, FORMAT_DATE);
      condition['$and'].push({
        $expr: {
          $gte: [
            {
              $dateToString: {
                date: '$transactionDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    }

    return this.transactionItem.aggregate([
      { $match: condition },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          warehouseCode: 1,
          warehouseName: 1,
          itemCode: 1,
          itemName: 1,
          locatorCode: 1,
          unit: 1,
          lotNumber: 1,
          storageCost: 1,
          orderCode: 1,
          quantityExported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.EXPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImported: {
            $cond: [
              {
                $and: [{ $eq: ['$actionType', ActionType.IMPORT] }],
              },
              '$actualQuantity',
              0,
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'daily-item-warehouse-stock-price',
          let: {
            companyCodeMap: '$companyCode',
            warehouseCodeMap: '$warehouseCode',
            itemCodeMap: '$itemCode',
            lotNumberMap: '$lotNumber',
          },
          pipeline: [
            {
              $sort: { reportDate: -1 },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$companyCode', '$$companyCodeMap'] },
                    { $eq: ['$warehouseCode', '$$warehouseCodeMap'] },
                    { $eq: ['$lotNumber', '$$lotNumberMap'] },
                    { $eq: ['$itemCode', '$$itemCodeMap'] },
                  ],
                },
              },
            },
            {
              $project: {
                averagePrice: {
                  $cond: {
                    if: '$quantity',
                    then: {
                      $divide: ['$price', '$quantity'],
                    },
                    else: 0,
                  },
                },
                quantity: 1,
                price: 1,
              },
            },
          ],
          as: 'priceItem',
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
            itemName: '$itemName',
            locatorCode: '$locatorCode',
            unit: '$unit',
            lotNumber: '$lotNumber',
            storageCost: { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            totalQuantity: { $arrayElemAt: ['$priceItem.quantity', 0] },
            totalPrice: { $arrayElemAt: ['$priceItem.price', 0] },
            orderCode: '$orderCode',
          },
          quantityExported: { $sum: '$quantityExported' },
          quantityImported: { $sum: '$quantityImported' },
          warehouseName: { $first: '$warehouseName' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          warehouseCode: '$_id.warehouseCode',
          itemCode: '$_id.itemCode',
          itemName: '$_id.itemName',
          locatorCode: '$_id.locatorCode',
          unit: '$_id.unit',
          lotNumber: '$_id.lotNumber',
          storageCost: '$_id.storageCost',
          orderCode: '$_id.orderCode',
          totalQuantity: '$_id.totalQuantity',
          totalPrice: '$_id.totalPrice',
          quantityExported: 1,
          quantityImported: 1,
          warehouseName: 1,
          quantity: { $subtract: ['$quantityImported', '$quantityExported'] },
          keyWarehouse: {
            $concat: ['$_id.companyCode', '-', '$_id.warehouseCode'],
          },
          storageDate: moment(request?.dateFrom).format(DATE_FOMAT_EXCELL),
        },
      },
      {
        $lookup: {
          from: 'report-order-item',
          let: {
            companyCodeMap: '$companyCode',
            warehouseCodeMap: '$warehouseCode',
            orderCodeMap: '$orderCode',
            itemCodeMap: '$itemCode',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$companyCode', '$$companyCodeMap'] },
                    { $eq: ['$warehouseCode', '$$warehouseCodeMap'] },
                    { $eq: ['$orderCode', '$$orderCodeMap'] },
                    { $eq: ['$itemCode', '$$itemCodeMap'] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                description: 1,
                account: 1,
              },
            },
          ],
          as: 'accountInfo',
        },
      },
      {
        $sort: { quantity: -1, storageDate: 1 },
      },
    ]);
  }

  async getByDateLot(request: ReportRequest) {
    const condition = {
      $and: [],
    };

    condition['$and'].push({
      companyCode: { $eq: request?.companyCode },
    });

    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    if (request?.dateFrom) {
      condition['$and'].push({
        $expr: {
          $gte: [
            {
              $dateToString: {
                date: '$transactionDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    }

    return this.transactionItem.aggregate([
      { $match: condition },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          warehouseCode: 1,
          warehouseName: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          lotNumber: 1,
          quantityExported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.EXPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImported: {
            $cond: [
              {
                $and: [{ $eq: ['$actionType', ActionType.IMPORT] }],
              },
              '$actualQuantity',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
            unit: '$unit',
            lotNumber: '$lotNumber',
          },
          quantityExported: { $sum: '$quantityExported' },
          quantityImported: { $sum: '$quantityImported' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          itemCode: '$_id.itemCode',
          itemName: '$_id.itemName',
          unit: '$_id.unit',
          lotNumber: '$_id.lotNumber',
          quantityExported: 1,
          quantityImported: 1,
        },
      },
      {
        $sort: { storageDate: 1 },
      },
    ]);
  }

  async getByDateItemCode(request: ReportRequest) {
    const condition = {
      $and: [],
    };

    condition['$and'].push({
      companyCode: { $eq: request?.companyCode },
    });

    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    const newDate = getTimezone(undefined, FORMAT_DATE);

    condition['$and'].push({
      $expr: {
        $gte: [
          {
            $dateToString: {
              date: '$transactionDate',
              format: '%Y-%m-%d',
              timezone: TIMEZONE_HCM_CITY,
            },
          },
          moment(newDate).format(DATE_FOMAT),
        ],
      },
    });
    return this.transactionItem.aggregate([
      { $match: condition },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          warehouseCode: 1,
          warehouseName: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          lotNumber: 1,
          locatorCode: 1,
          manufacturingCountry: 1,
          quantityExported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.EXPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImported: {
            $cond: [
              {
                $and: [{ $eq: ['$actionType', ActionType.IMPORT] }],
              },
              '$actualQuantity',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemName: '$itemName',
            unit: '$unit',
            lotNumber: '$lotNumber',
            itemCode: '$itemCode',
            locatorCode: '$locatorCode',
            manufacturingCountry: '$manufacturingCountry',
          },
          quantityExported: { $sum: '$quantityExported' },
          quantityImported: { $sum: '$quantityImported' },
          warehouseName: { $first: '$warehouseName' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          warehouseCode: '$_id.warehouseCode',
          itemCode: '$_id.itemCode',
          itemName: '$_id.itemName',
          unit: '$_id.unit',
          lotNumber: '$_id.lotNumber',
          locatorCode: '$_id.locatorCode',
          keyMap: '$_id.keyMap',
          manufacturingCountry: '$_id.manufacturingCountry',
          warehouseName: 1,
          quantityExported: 1,
          quantityImported: 1,
        },
      },
    ]);
  }
}
