import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderType } from '@enums/order-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemRequest } from '@requests/sync-daily.request';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { DATE_FOMAT, MONTHS, YEARS } from '@utils/constant';
import * as moment from 'moment';
import { Model } from 'mongoose';
@Injectable()
export class DailyLotLocatorStockRepository extends BaseAbstractRepository<DailyLotLocatorStock> {
  constructor(
    @InjectModel(DailyLotLocatorStock.name)
    private readonly dailyLotLocatorStock: Model<DailyLotLocatorStock>,
  ) {
    super(dailyLotLocatorStock);
  }

  async createMany(
    dailyWarehouseItemRequests: DailyWarehouseItemRequest[],
  ): Promise<void> {
    for (const dailyWarehouseItemRequest of dailyWarehouseItemRequests) {
      for (const dailyItemLocatorStock of dailyWarehouseItemRequest.dailyItemLocatorStocks) {
        for (const dailyLotLocatorStock of dailyItemLocatorStock.dailyLotLocatorStocks) {
          const document = new this.dailyLotLocatorStock();
          Object.assign(
            document,
            dailyWarehouseItemRequest,
            dailyItemLocatorStock,
            dailyLotLocatorStock,
          );
          await document.save();
        }
      }
    }
  }

  async getReports(request: ReportRequest): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };

    if (request?.dateFrom) {
      const today = moment(request?.dateTo).startOf('day');
      const tomorrow = moment(today).endOf('day');
      condition['$and'].push({
        reportDate: { $gte: today, $lte: tomorrow },
      });
    }
    if (request?.companyId)
      condition['$and'].push({
        companyId: { $eq: request?.companyId },
      });
    if (request?.warehouseId)
      condition['$and'].push({
        warehouseId: { $eq: request?.warehouseId },
      });

    return this.dailyLotLocatorStock
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1, lotNumber: 1, stockQuantity: 1 })
      .lean();
  }

  async getReportItemInventory(
    request: ReportRequest,
  ): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };

    const reportOrderItemLot = [];

    if (request?.dateTo) {
      condition['$and'].push({
        reportDate: { $lte: new Date(request?.dateTo) },
      });
      reportOrderItemLot.push({
        $lte: ['$orderCreatedAt', new Date(request?.dateTo)],
      });
    } else {
      condition['$and'].push({
        reportDate: { $lte: new Date() },
      });
      reportOrderItemLot.push({
        $lte: ['$orderCreatedAt', new Date(request?.dateTo)],
      });
    }

    if (request?.dateFrom) {
      condition['$and'].push({
        reportDate: { $gte: new Date(request?.dateFrom) },
      });
      reportOrderItemLot.push({
        $gte: ['$orderCreatedAt', new Date(request?.dateFrom)],
      });
    } else {
      condition['$and'].push({
        reportDate: { $gte: new Date() },
      });
      reportOrderItemLot.push({
        $gte: ['$orderCreatedAt', new Date()],
      });
    }

    if (request?.companyId) {
      condition['$and'].push({
        companyId: { $eq: request?.companyId },
      });
    }
    if (request?.warehouseId) {
      condition['$and'].push({
        warehouseId: { $eq: request?.warehouseId },
      });
    }

    return this.dailyLotLocatorStock.aggregate([
      {
        $match: condition,
      },
      {
        $project: {
          companyId: 1,
          companyName: 1,
          companyAddress: 1,
          warehouseId: 1,
          warehouseCode: 1,
          warehouseName: 1,
          itemId: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          lotNumber: 1,
          cost: 1,
          note: 1,
          stockStart: {
            $cond: [
              {
                $eq: [
                  {
                    $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
                  },
                  moment(request?.dateFrom || new Date()).format(DATE_FOMAT),
                ],
              },
              '$stockQuantity',
              0,
            ],
          },
          stockEnd: {
            $cond: [
              {
                $eq: [
                  {
                    $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
                  },
                  moment(request?.dateTo || new Date()).format(DATE_FOMAT),
                ],
              },
              '$stockQuantity',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            companyId: '$companyId',
            companyName: '$companyName',
            companyAddress: '$companyAddress',
            warehouseId: '$warehouseId',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemId: '$itemId',
            itemCode: '$itemCode',
            itemName: '$itemName',
            unit: '$unit',
            lotNumber: '$lotNumber',
            cost: '$cost',
            reportDate: {
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
            },
            note: '$note',
          },
          stockStart: { $sum: '$stockStart' },
          stockEnd: { $sum: '$stockEnd' },
        },
      },
      {
        $lookup: {
          from: 'report-order-item-lot',
          let: {
            companyId: '$_id.companyId',
            itemId: '$_id.itemId',
            warehouseId: '$_id.warehouseId',
            lotNumber: '$_id.lotNumber',
          },
          as: 'report-order-item-lot',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$companyId', '$$companyId'] },
                    { $eq: ['$warehouseId', '$$warehouseId'] },
                    { $eq: ['$itemId', '$$itemId'] },
                    { $eq: ['$lotNumber', '$$lotNumber'] },
                    {
                      $or: [
                        {
                          $eq: ['$orderType', OrderType.IMPORT],
                        },
                        {
                          $eq: ['$orderType', OrderType.EXPORT],
                        },
                      ],
                    },
                    ...reportOrderItemLot,
                  ],
                },
              },
            },
            {
              $project: {
                itemId: 1,
                orderType: 1,
                importIn: {
                  $cond: [
                    {
                      $eq: ['$orderType', OrderType.IMPORT],
                    },
                    '$actualQuantity',
                    0,
                  ],
                },
                exportIn: {
                  $cond: [
                    {
                      $eq: ['$orderType', OrderType.EXPORT],
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
                  itemId: '$itemId',
                  orderType: '$orderType',
                },
                importIn: { $sum: '$importIn' },
                exportIn: { $sum: '$exportIn' },
              },
            },
            {
              $project: {
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            companyId: '$_id.companyId',
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
            warehouseId: '$_id.warehouseId',
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
          },
          items: {
            $push: {
              itemId: '$_id.itemId',
              itemCode: '$_id.itemCode',
              itemName: '$_id.itemName',
              unit: '$_id.unit',
              lotNumber: '$_id.lotNumber',
              cost: '$_id.cost',

              stockStart: '$stockStart',
              totalStockStart: {
                $multiply: ['$_id.cost', '$stockStart'],
              },

              importIn: { $sum: '$report-order-item-lot.importIn' },
              totalImportIn: {
                $multiply: [
                  '$_id.cost',
                  { $sum: '$report-order-item-lot.importIn' },
                ],
              },

              exportIn: { $sum: '$report-order-item-lot.exportIn' },
              totalExportIn: {
                $multiply: [
                  '$_id.cost',
                  { $sum: '$report-order-item-lot.exportIn' },
                ],
              },

              stockEnd: '$stockEnd',
              totalStockEnd: {
                $multiply: ['$_id.cost', '$stockEnd'],
              },

              note: '$_id.note',
            },
          },
        },
      },
      {
        $sort: { warehouseId: -1, itemId: -1 },
      },
    ]);
  }

  async getReportAgeOfItemStock(
    request: ReportRequest,
  ): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };

    if (request?.companyId)
      condition['$and'].push({
        companyId: { $eq: request?.companyId },
      });

    if (request?.warehouseId)
      condition['$and'].push({
        warehouseId: { $eq: request?.warehouseId },
      });
    return this.dailyLotLocatorStock.aggregate([
      // {
      //   $match: condition,
      // },
      {
        $sort: { storageDate: -1 },
      },
      {
        $group: {
          _id: {
            companyId: '$companyId',
            companyName: '$companyName',
            companyAddress: '$companyAddress',
            warehouseId: '$warehouseId',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
          },
          groupByStorageDate: {
            $push: {
              storageDate: '$storageDate',
              origin: '$origin',
              account: '$account',
              lotNumber: '$lotNumber',
              locatorCode: '$locatorCode',
              unit: '$unit',
              stockQuantity: '$stockQuantity',
              cost: '$cost',
              totalPrice: { $multiply: ['$cost', '$stockQuantity'] },
              ...getQueryAgeOfItems(),
            },
          },
        },
      },
      {
        $group: {
          _id: {
            warehouseId: '$_id.warehouseId',
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
            companyId: '$_id.companyId',
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
          },
          items: {
            $push: {
              itemCode: '$_id.itemCode',
              itemName: '$_id.itemName',
              totalQuantity: { $sum: '$groupByStorageDate.stockQuantity' },
              totalPrice: { $sum: '$groupByStorageDate.totalPrice' },
              sixMonthAgo: { $sum: '$groupByStorageDate.sixMonthAgo' },
              oneYearAgo: { $sum: '$groupByStorageDate.oneYearAgo' },
              twoYearAgo: { $sum: '$groupByStorageDate.twoYearAgo' },
              threeYearAgo: { $sum: '$groupByStorageDate.threeYearAgo' },
              fourYearAgo: { $sum: '$groupByStorageDate.fourYearAgo' },
              fiveYearAgo: { $sum: '$groupByStorageDate.fiveYearAgo' },
              greaterfiveYear: { $sum: '$groupByStorageDate.greaterfiveYear' },
              groupByStorageDate: '$groupByStorageDate',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            companyId: '$_id.companyId',
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
          },
          warehouses: {
            $push: {
              warehouseId: '$_id.warehouseId',
              warehouseCode: '$_id.warehouseCode',
              warehouseName: '$_id.warehouseName',
              totalPrice: { $sum: '$items.totalPrice' },
              sixMonth: { $sum: '$items.sixMonthAgo' },
              oneYearAgo: { $sum: '$items.oneYearAgo' },
              twoYearAgo: { $sum: '$items.twoYearAgo' },
              threeYearAgo: { $sum: '$items.threeYearAgo' },
              fourYearAgo: { $sum: '$items.fourYearAgo' },
              fiveYearAgo: { $sum: '$items.fiveYearAgo' },
              greaterfiveYear: { $sum: '$items.greaterfiveYear' },
              items: '$items',
            },
          },
        },
      },
    ]);
  }
}

function getQueryAgeOfItems(sum = false) {
  const sixMonthAgo = moment().subtract(6, MONTHS).toISOString();
  const oneYearAgo = moment().subtract(1, YEARS).toISOString();
  const twoYearAgo = moment().subtract(2, YEARS).toISOString();
  const threeYearAgo = moment().subtract(3, YEARS).toISOString();
  const fourYearAgo = moment().subtract(4, YEARS).toISOString();
  const fiveYearAgo = moment().subtract(5, YEARS).toISOString();
  return {
    sixMonthAgo: {
      $cond: [
        { $gt: ['$storageDate', new Date(sixMonthAgo)] },
        { $multiply: ['$cost', '$stockQuantity'] },
        0,
      ],
    },
    oneYearAgo: {
      $cond: [
        {
          $and: [
            { $lte: ['$storageDate', new Date(sixMonthAgo)] },
            { $gt: ['$storageDate', new Date(oneYearAgo)] },
          ],
        },
        { $multiply: ['$cost', '$stockQuantity'] },
        0,
      ],
    },
    twoYearAgo: {
      $cond: [
        {
          $and: [
            { $lte: ['$storageDate', new Date(oneYearAgo)] },
            { $gt: ['$storageDate', new Date(twoYearAgo)] },
          ],
        },
        { $multiply: ['$cost', '$stockQuantity'] },
        0,
      ],
    },
    threeYearAgo: {
      $cond: [
        {
          $and: [
            { $lte: ['$storageDate', new Date(twoYearAgo)] },
            { $gt: ['$storageDate', new Date(threeYearAgo)] },
          ],
        },
        { $multiply: ['$cost', '$stockQuantity'] },
        0,
      ],
    },
    fourYearAgo: {
      $cond: [
        {
          $and: [
            { $lte: ['$storageDate', new Date(threeYearAgo)] },
            { $gt: ['$storageDate', new Date(fourYearAgo)] },
          ],
        },
        { $multiply: ['$cost', '$stockQuantity'] },
        0,
      ],
    },
    fiveYearAgo: {
      $cond: [
        {
          $and: [
            { $lte: ['$storageDate', new Date(fourYearAgo)] },
            { $gt: ['$storageDate', new Date(fiveYearAgo)] },
          ],
        },
        { $multiply: ['$cost', '$stockQuantity'] },
        0,
      ],
    },
    greaterfiveYear: {
      $cond: [
        {
          $and: [{ $lt: ['$storageDate', new Date(fiveYearAgo)] }],
        },
        { $multiply: ['$cost', '$stockQuantity'] },
        0,
      ],
    },
  };
}
