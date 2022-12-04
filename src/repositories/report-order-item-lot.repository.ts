import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemLotInteface } from '@schemas/interface/report-order-item-lot.interface';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { DATE_FOMAT } from '@utils/constant';
import { Model } from 'mongoose';
import * as moment from 'moment';

@Injectable()
export class ReportOrderItemLotRepository extends BaseAbstractRepository<ReportOrderItemLot> {
  constructor(
    @InjectModel(ReportOrderItemLot.name)
    private readonly reportOrderItemLot: Model<ReportOrderItemLot>,
  ) {
    super(reportOrderItemLot);
  }

  async save(data: ReportOrderItemLotInteface) {
    const document = new this.reportOrderItemLot();
    Object.assign(document, data);

    await document.save();
  }

  async getReportItemInventory(request: ReportRequest): Promise<any[]> {
    const condition = {
      $and: [],
    };
    condition['$and'].push({
      orderType: { $in: [OrderType.IMPORT, OrderType.EXPORT] },
    });
    const dailyLotLocatorStock = {
      $or: [],
    };

    if (request?.dateFrom) {
      condition['$and'].push({
        orderCreatedAt: { $gte: new Date(request?.dateFrom) },
      });
      dailyLotLocatorStock['$or'].push({
        $eq: [
          {
            $dateToString: {
              date: '$reportDate',
              format: '%Y-%m-%d',
            },
          },
          moment(request?.dateFrom || new Date()).format(DATE_FOMAT),
        ],
      });
    }

    if (request?.dateTo) {
      condition['$and'].push({
        orderCreatedAt: { $lte: new Date(request?.dateTo) },
      });
      dailyLotLocatorStock['$or'].push({
        $eq: [
          {
            $dateToString: {
              date: '$reportDate',
              format: '%Y-%m-%d',
            },
          },
          moment(request?.dateTo || new Date()).format(DATE_FOMAT),
        ],
      });
    }

    if (request?.companyCode) {
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    }
    if (request?.warehouseCode) {
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });
    }

    return this.reportOrderItemLot.aggregate([
      {
        $match: condition,
      },
      {
        $project: {
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
          note: 1,
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
            companyCode: '$companyCode',
            companyName: '$companyName',
            companyAddress: '$companyAddress',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
            unit: '$unit',
            lotNumber: '$lotNumber',
            storageCost: '$storageCost',
            reportDate: {
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
            },
            note: '$note',
          },
          importIn: { $sum: '$importIn' },
          exportIn: { $sum: '$exportIn' },
        },
      },
      {
        $lookup: {
          from: 'daily-lot-locator-stock',
          let: {
            companyCode: '$_id.companyCode',
            itemCode: '$_id.itemCode',
            warehouseCode: '$_id.warehouseCode',
            lotNumber: '$_id.lotNumber',
          },
          as: 'daily-lot-locator-stock',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$companyCode', '$$companyCode'] },
                    { $eq: ['$warehouseCode', '$$warehouseCode'] },
                    { $eq: ['$itemCode', '$$itemCode'] },
                    { $eq: ['$lotNumber', '$$lotNumber'] },
                    dailyLotLocatorStock,
                  ],
                },
              },
            },
            {
              $project: {
                itemCode: 1,
                stockStart: {
                  $cond: [
                    {
                      $eq: [
                        {
                          $dateToString: {
                            date: '$reportDate',
                            format: '%Y-%m-%d',
                          },
                        },
                        moment(request?.dateFrom || new Date()).format(
                          DATE_FOMAT,
                        ),
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
                          $dateToString: {
                            date: '$reportDate',
                            format: '%Y-%m-%d',
                          },
                        },
                        moment(request?.dateTo || new Date()).format(
                          DATE_FOMAT,
                        ),
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
                  itemCode: '$itemCode',
                },
                stockStart: { $sum: '$stockStart' },
                stockEnd: { $sum: '$stockEnd' },
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
            companyCode: '$_id.companyCode',
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
          },
          items: {
            $push: {
              itemCode: '$_id.itemCode',
              itemName: '$_id.itemName',
              unit: '$_id.unit',
              lotNumber: '$_id.lotNumber',
              storageCost: '$_id.storageCost',

              stockStart: { $sum: '$daily-lot-locator-stock.stockStart' },
              totalStockStart: {
                $multiply: [
                  '$_id.storageCost',
                  { $sum: '$daily-lot-locator-stock.stockStart' },
                ],
              },

              importIn: '$importIn',
              totalImportIn: {
                $multiply: ['$_id.storageCost', '$importIn'],
              },

              exportIn: '$exportIn',
              totalExportIn: {
                $multiply: ['$_id.storageCost', '$exportIn'],
              },

              stockEnd: { $sum: '$daily-lot-locator-stock.stockEnd' },
              totalStockEnd: {
                $multiply: [
                  '$_id.storageCost',
                  { $sum: '$daily-lot-locator-stock.stockEnd' },
                ],
              },

              note: '$_id.note',
            },
          },
        },
      },
      {
        $sort: { warehouseCode: -1, itemCode: -1 },
      },
      {
        $group: {
          _id: {
            companyCode: '$_id.companyCode',
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
          },
          warehouses: {
            $push: {
              warehouseCode: '$_id.warehouseCode',
              warehouseName: '$_id.warehouseName',
              items: '$items',
            },
          },
        },
      },
    ]);
  }

  async getReports(
    request: ReportRequest,
    type: OrderType,
  ): Promise<ReportOrderItemLot[]> {
    const condition = {
      $and: [],
    };

    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });
    if (request?.constructionCode)
      condition['$and'].push({
        constructionCode: { $eq: request?.constructionCode },
      });

    if (request?.dateFrom)
      condition['$and'].push({
        orderCreatedAt: { $gte: new Date(request?.dateFrom) },
      });

    if (request?.dateTo)
      condition['$and'].push({
        orderCreatedAt: { $lte: new Date(request?.dateTo) },
      });

    switch (type) {
      case OrderType.IMPORT:
      case OrderType.EXPORT:
      case OrderType.TRANSFER:
      case OrderType.INVENTORY:
        condition['$and'].push({
          orderType: { $eq: type },
        });
        break;
      default:
        break;
    }

    switch (request?.reportType) {
      case ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.Completed,
              OrderStatus.Confirmed,
              OrderStatus.Stored,
            ],
          },
        });

        break;
      case ReportType.ITEM_INVENTORY_IMPORTED_NO_QR_CODE:
        condition['$and'].push({
          qrCode: { $eq: null },
        });
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.Completed,
              OrderStatus.Confirmed,
              OrderStatus.Stored,
            ],
          },
        });
        break;
      case ReportType.SITUATION_IMPORT_PERIOD:
        break;
      case ReportType.SITUATION_EXPORT_PERIOD:
        break;
      case ReportType.SITUATION_TRANSFER:
        break;
    }

    if (
      request?.reportType === ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION
    ) {
      return reportItemImportedButNotPutToPosition(
        this.reportOrderItemLot,
        condition,
      );
    }
    return this.reportOrderItemLot
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1 })
      .lean();
  }

  async getReportsGroupByWarehouse(
    request: ReportRequest,
    type: OrderType,
  ): Promise<ReportOrderItemLot[]> {
    const condition = {
      $and: [],
    };

    if (request?.departmentReceiptCode)
      condition['$and'].push({
        departmentReceiptCode: { $eq: request?.departmentReceiptCode },
      });
    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });
    if (request?.constructionCode)
      condition['$and'].push({
        constructionCode: { $eq: request?.constructionCode },
      });

    if (request?.dateFrom)
      condition['$and'].push({
        orderCreatedAt: { $gte: new Date(request?.dateFrom) },
      });

    if (request?.dateTo)
      condition['$and'].push({
        orderCreatedAt: { $lte: new Date(request?.dateTo) },
      });

    switch (type) {
      case OrderType.IMPORT:
      case OrderType.EXPORT:
      case OrderType.TRANSFER:
      case OrderType.INVENTORY:
        condition['$and'].push({
          orderType: { $eq: type },
        });
        break;
      default:
        break;
    }

    switch (request?.reportType) {
      case ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION:
        condition['$and'].push({
          locatorCode: { $eq: null },
        });

        condition['$and'].push({
          status: {
            $in: [OrderStatus.Stored, OrderStatus.Completed],
          },
        });
        break;
      case ReportType.SITUATION_IMPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.Received,
              OrderStatus.Confirmed,
              OrderStatus.InProgress,
              OrderStatus.Completed,
            ],
          },
        });
        break;
      case ReportType.SITUATION_EXPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.Pending,
              OrderStatus.InProgress,
              OrderStatus.Completed,
            ],
          },
        });

        break;
      case ReportType.SITUATION_TRANSFER:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.Completed,
              OrderStatus.Stored,
              OrderStatus.Received,
            ],
          },
        });
        break;
      default:
        break;
    }

    switch (request?.reportType) {
      case ReportType.SITUATION_TRANSFER:
        return reportSituationTransfer(this.reportOrderItemLot, condition);
      case ReportType.SITUATION_INVENTORY_PERIOD:
        return reportSituationInventory(this.reportOrderItemLot, condition);
      case ReportType.SITUATION_IMPORT_PERIOD:
        return reportSituationImport(this.reportOrderItemLot, condition);
      case ReportType.SITUATION_EXPORT_PERIOD:
        return reportSituationExport(this.reportOrderItemLot, condition);
      default:
        break;
    }
  }
}
function reportItemImportedButNotPutToPosition(
  reportOrderItemLot: Model<ReportOrderItemLot>,
  condition: any,
) {
  return reportOrderItemLot.aggregate([
    { $match: condition },
    {
      $group: {
        _id: {
          companyAddress: '$companyAddress',
          companyName: '$companyName',
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          orderCode: '$orderCode',
          ebsNumber: '$ebsNumber',
          reason: '$reason',
          explain: '$explain',
          itemCode: '$itemCode',
          itemName: '$itemName',
          unit: '$unit',
          lotNumber: '$lotNumber',
          note: '$note',
          performerName: '$performerName',
        },
        totalPlanQuantity: { $sum: '$planQuantity' },
        totalActualQuantity: { $sum: '$actualQuantity' },
      },
    },
    {
      $sort: { '_id.itemCode': -1 },
    },
    {
      $group: {
        _id: {
          companyAddress: '$_id.companyAddress',
          companyName: '$_id.companyName',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
        },
        items: {
          $push: {
            index: '',
            orderCode: '$_id.orderCode',
            ebsNumber: '$_id.ebsNumber',
            reason: '$_id.reason',
            explain: '$_id.explain',
            itemCode: '$_id.itemCode',
            itemName: '$_id.itemName',
            unit: '$_id.unit',
            lotNumber: '$_id.lotNumber',
            planQuantity: { $sum: '$totalPlanQuantity' },
            actualQuantity: { $sum: '$totalActualQuantity' },
            remainQuantity: {
              $subtract: [
                { $sum: '$totalPlanQuantity' },
                { $sum: '$totalActualQuantity' },
              ],
            },
            note: '$_id.note',
            performerName: '$_id.performerName',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseCode': -1 },
    },
    {
      $group: {
        _id: {
          companyAddress: '$_id.companyAddress',
          companyName: '$_id.companyName',
        },
        warehouses: {
          $push: {
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
            items: '$items',
          },
        },
      },
    },
    {
      $sort: { '_id.companyName': -1 },
    },
  ]);
}

function reportSituationExport(
  reportOrderItemLot: Model<ReportOrderItemLot>,
  condition: any,
) {
  return reportOrderItemLot.aggregate([
    { $match: condition },
    {
      $sort: { itemCode: -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
          reason: '$reason',
          orderCode: '$orderCode',
          orderCreatedAt: {
            $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
          },
          constructionName: '$constructionName',
          departmentReceiptName: '$departmentReceiptName',
          explain: '$explain',
        },
        items: {
          $push: {
            itemCode: '$itemCode',
            itemName: '$itemName',
            lotNumber: '$lotNumber',
            accountDebt: '$accountDebt',
            accountHave: '$accountHave',
            unit: '$unit',
            planQuantity: '$planQuantity',
            exportedQuantity: '$exportedQuantity',
            locatorCode: '$locatorCode',
            storageCost: '$storageCost',
            totalPrice: { $multiply: ['$storageCost', '$exportedQuantity'] },
          },
        },
      },
    },
    {
      $sort: { '_id.orderCode': -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          reason: '$_id.reason',
        },
        orders: {
          $push: {
            orderCode: '$_id.orderCode',
            orderCreatedAt: '$_id.orderCreatedAt',
            contract: '$_id.contract',
            constructionName: '$_id.constructionName',
            providerName: '$_id.providerName',
            departmentReceiptName: '$_id.departmentReceiptName',
            explain: '$_id.explain',
            totalPrice: { $sum: '$items.totalPrice' },
            items: '$items',
          },
        },
      },
    },
    {
      $sort: { '_id.reason': -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        reasons: {
          $push: {
            value: '$_id.reason',
            totalPrice: { $sum: '$orders.totalPrice' },
            orders: '$orders',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseCode': -1 },
    },
    {
      $group: {
        _id: {
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        warehouses: {
          $push: {
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
            reasons: '$reasons',
            totalPrice: { $sum: '$reasons.totalPrice' },
          },
        },
      },
    },
  ]);
}

function reportSituationImport(
  reportOrderItemLot: Model<ReportOrderItemLot>,
  condition: any,
) {
  return reportOrderItemLot.aggregate([
    { $match: condition },
    {
      $sort: { itemCode: -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
          reason: '$reason',
          orderCode: '$orderCode',
          orderCreatedAt: {
            $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
          },
          contract: '$contract',
          constructionName: '$constructionName',
          providerName: '$providerName',
          departmentReceiptName: '$departmentReceiptName',
          explain: '$explain',
        },
        items: {
          $push: {
            itemCode: '$itemCode',
            itemName: '$itemName',
            lotNumber: '$lotNumber',
            accountDebt: '$accountDebt',
            accountHave: '$accountHave',
            unit: '$unit',
            actualQuantity: '$actualQuantity',
            locatorCode: '$locatorCode',
            storageCost: '$storageCost',
            totalPrice: { $multiply: ['$storageCost', '$actualQuantity'] },
          },
        },
      },
    },
    {
      $sort: { '_id.orderCode': -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          reason: '$_id.reason',
        },
        orders: {
          $push: {
            orderCode: '$_id.orderCode',
            orderCreatedAt: '$_id.orderCreatedAt',
            contract: '$_id.contract',
            constructionName: '$_id.constructionName',
            providerName: '$_id.providerName',
            departmentReceiptName: '$_id.departmentReceiptName',
            explain: '$_id.explain',
            totalPrice: { $sum: '$items.totalPrice' },
            items: '$items',
          },
        },
      },
    },
    {
      $sort: { '_id.reason': -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        reasons: {
          $push: {
            value: '$_id.reason',
            totalPrice: { $sum: '$orders.totalPrice' },
            orders: '$orders',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseCode': -1 },
    },
    {
      $group: {
        _id: {
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        warehouses: {
          $push: {
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
            totalPrice: { $sum: '$reasons.totalPrice' },
            reasons: '$reasons',
          },
        },
      },
    },
  ]);
}

function reportSituationTransfer(
  reportOrderItemLot: Model<ReportOrderItemLot>,
  condition: any,
) {
  return reportOrderItemLot.aggregate([
    { $match: condition },
    {
      $sort: { itemCode: 1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
          orderCode: '$orderCode',
          orderCreatedAt: {
            $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
          },
          warehouseTargetName: '$warehouseTargetName',
          warehouseTargetCode: '$warehouseTargetCode',
          explain: '$explain',
        },
        items: {
          $push: {
            itemCode: '$itemCode',
            itemName: '$itemName',
            lotNumber: '$lotNumber',
            accountDebt: '$accountDebt',
            accountHave: '$accountHave',
            unit: '$unit',
            planQuantity: '$planQuantity',
            locatorCode: '$locatorCode',
            storageCost: '$storageCost',
            totalPrice: { $multiply: ['$storageCost', '$planQuantity'] },
          },
        },
      },
    },
    {
      $sort: { '_id.orderCode': -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        orders: {
          $push: {
            orderCode: '$_id.orderCode',
            orderCreatedAt: '$_id.orderCreatedAt',
            totalPrice: { $sum: '$items.totalPrice' },
            warehouseImport: {
              $concat: [
                '$_id.warehouseTargetName',
                '_',
                '$_id.warehouseTargetCode',
              ],
            },
            explain: '$_id.explain',
            items: '$items',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseCode': -1 },
    },
    {
      $group: {
        _id: {
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        warehouses: {
          $push: {
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
            totalPrice: { $sum: '$orders.totalPrice' },
            orders: '$orders',
          },
        },
      },
    },
  ]);
}

function reportSituationInventory(
  reportOrderItemLot: Model<ReportOrderItemLot>,
  condition: any,
) {
  return reportOrderItemLot.aggregate([
    { $match: condition },
    {
      $sort: { itemCode: -1 },
    },
    {
      $group: {
        _id: {
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
        },
        totalPlanQuantity: { $sum: '$planQuantity' },
        totalActualQuantity: { $sum: '$actualQuantity' },
        items: {
          $push: {
            itemCode: '$itemCode',
            itemName: '$itemName',
            lotNumber: '$lotNumber',
            unit: '$unit',
            totalPlanQuantity: { $sum: '$planQuantity' },
            totalPricePlan: {
              $sum: { $multiply: ['$storageCost', '$planQuantity'] },
            },
            totalActualQuantity: { $sum: '$actualQuantity' },
            totalPriceActual: {
              $sum: { $multiply: ['$storageCost', '$actualQuantity'] },
            },
            storageCost: '$storageCost',
            note: '$note',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseCode': -1 },
    },
  ]);
}
