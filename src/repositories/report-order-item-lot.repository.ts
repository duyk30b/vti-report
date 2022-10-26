import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { ReportOrderRequest } from '@requests/sync-daily.request';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReportOrderItemLotRepository extends BaseAbstractRepository<ReportOrderItemLot> {
  constructor(
    @InjectModel(ReportOrderItemLot.name)
    private readonly reportOrderItemLot: Model<ReportOrderItemLot>,
  ) {
    super(reportOrderItemLot);
  }

  async createMany(reportOrderRequests: ReportOrderRequest[]): Promise<void> {
    for (const reportOrderRequest of reportOrderRequests) {
      for (const reportOrderItem of reportOrderRequest.reportOrderItems) {
        for (const reportOrderItemLot of reportOrderItem.reportOrderItemLots) {
          const document = new this.reportOrderItemLot();
          Object.assign(
            document,
            reportOrderRequest,
            reportOrderItem,
            reportOrderItemLot,
          );

          await document.save();
        }
      }
    }
  }

  async getReports(
    request: ReportRequest,
    type: OrderType,
  ): Promise<ReportOrderItemLot[]> {
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
    if (request?.constructionId)
      condition['$and'].push({
        constructionId: { $eq: request?.constructionId },
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
          status: { $in: [OrderStatus.IMPORTED, OrderStatus.STORED] },
        });

        break;
      case ReportType.ITEM_INVENTORY_IMPORTED_NO_QR_CODE:
        condition['$and'].push({
          qrCode: { $eq: null },
        });
        condition['$and'].push({
          status: { $eq: OrderStatus.IMPORTED },
        });
        break;
      case ReportType.SITUATION_IMPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.RECEIVED,
              OrderStatus.RECEIVING,
              OrderStatus.STORING,
              OrderStatus.IMPORT_COMPLETED,
            ],
          },
        });
        break;
      case ReportType.SITUATION_EXPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.EXPORTED,
              OrderStatus.EXPORTING,
              OrderStatus.EXPORT_COMPLETED,
              OrderStatus.NOT_YET_EXPORT,
            ],
          },
        });
        break;
      case ReportType.SITUATION_TRANSFER:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.IMPORTED,
              OrderStatus.EXPORTED,
              OrderStatus.TRANSFER_COMPLETED,
            ],
          },
        });
        break;
      default:
        break;
    }

    if (ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION) {
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

    if (request?.companyId)
      condition['$and'].push({
        companyId: { $eq: request?.companyId },
      });
    if (request?.warehouseId)
      condition['$and'].push({
        warehouseId: { $eq: request?.warehouseId },
      });
    if (request?.constructionId)
      condition['$and'].push({
        constructionId: { $eq: request?.constructionId },
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
          locationId: { $eq: null },
        });
        condition['$and'].push({
          status: { $eq: OrderStatus.IMPORTED },
        });
        break;
      case ReportType.SITUATION_IMPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.RECEIVED,
              OrderStatus.RECEIVING,
              OrderStatus.STORING,
              OrderStatus.IMPORT_COMPLETED,
            ],
          },
        });
        break;
      case ReportType.SITUATION_EXPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [OrderStatus.EXPORTING, OrderStatus.EXPORT_COMPLETED],
          },
        });

        break;
      case ReportType.SITUATION_TRANSFER:
        condition['$and'].push({
          status: {
            $in: [
              OrderStatus.IMPORTED,
              OrderStatus.EXPORTED,
              OrderStatus.TRANSFER_COMPLETED,
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
          warehouseId: '$warehouseId',
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          orderCode: '$orderCode',
          orderNumberEbs: '$orderNumberEbs',
          reason: '$reason',
          explain: '$explain',
          itemId: '$itemId',
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
      $sort: { '_id.itemId': -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$_id.warehouseId',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
        },
        items: {
          $push: {
            index: '',
            orderCode: '$_id.orderCode',
            orderNumberEbs: '$_id.orderNumberEbs',
            reason: '$_id.reason',
            explain: '$_id.explain',
            itemCode: '$_id.itemCode',
            itemName: '$_id.itemName',
            unit: '$_id.unit',
            lotNumber: '$_id.lotNumber',
            planQuantity: { $sum: '$totalPlanQuantity' },
            actualQuantity: { $sum: '$totalActualQuantity' },
            remainQuantity: {
              $subtract: ['$totalActualQuantity', '$totalActualQuantity'],
            },
            note: '$_id.note',
            performerName: '$_id.performerName',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseId': -1 },
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
      $sort: { itemId: -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$warehouseId',
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
          purpose: '$purpose',
          orderId: '$orderId',
          orderCode: '$orderCode',
          orderCreatedAt: {
            $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
          },
          constructionName: '$constructionName',
          receiveDepartmentName: '$receiveDepartmentName',
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
            locationCode: '$locationCode',
            cost: '$cost',
            totalPrice: { $multiply: ['$cost', '$exportedQuantity'] },
          },
        },
      },
    },
    {
      $sort: { '_id.orderId': -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$_id.warehouseId',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          purpose: '$_id.purpose',
        },
        orders: {
          $push: {
            orderCode: '$_id.orderCode',
            orderCreatedAt: '$_id.orderCreatedAt',
            contract: '$_id.contract',
            constructionName: '$_id.constructionName',
            providerName: '$_id.providerName',
            receiveDepartmentName: '$_id.receiveDepartmentName',
            explain: '$_id.explain',
            totalPrice: { $sum: '$items.totalPrice' },
            items: '$items',
          },
        },
      },
    },
    {
      $sort: { '_id.purpose': -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$_id.warehouseId',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        purposes: {
          $push: {
            value: '$_id.purpose',
            totalPrice: { $sum: '$orders.totalPrice' },
            orders: '$orders',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseId': -1 },
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
            purposes: '$purposes',
            totalPrice: { $sum: '$purposes.totalPrice' },
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
      $sort: { itemId: -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$warehouseId',
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
          purpose: '$purpose',
          orderId: '$orderId',
          orderCode: '$orderCode',
          orderCreatedAt: {
            $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
          },
          contract: '$contract',
          constructionName: '$constructionName',
          providerName: '$providerName',
          receiveDepartmentName: '$receiveDepartmentName',
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
            locationCode: '$locationCode',
            cost: '$cost',
            totalPrice: { $multiply: ['$cost', '$actualQuantity'] },
          },
        },
      },
    },
    {
      $sort: { '_id.orderId': -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$_id.warehouseId',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          purpose: '$_id.purpose',
        },
        orders: {
          $push: {
            orderCode: '$_id.orderCode',
            orderCreatedAt: '$_id.orderCreatedAt',
            contract: '$_id.contract',
            constructionName: '$_id.constructionName',
            providerName: '$_id.providerName',
            receiveDepartmentName: '$_id.receiveDepartmentName',
            explain: '$_id.explain',
            totalPrice: { $sum: '$items.totalPrice' },
            items: '$items',
          },
        },
      },
    },
    {
      $sort: { '_id.purpose': -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$_id.warehouseId',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        purposes: {
          $push: {
            value: '$_id.purpose',
            totalPrice: { $sum: '$orders.totalPrice' },
            orders: '$orders',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseId': -1 },
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
            totalPrice: { $sum: '$purposes.totalPrice' },
            purposes: '$purposes',
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
      $sort: { itemId: 1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$warehouseId',
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
          orderId: '$orderId',
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
            locationCode: '$locationCode',
            cost: '$cost',
            totalPrice: { $multiply: ['$cost', '$planQuantity'] },
          },
        },
      },
    },
    {
      $sort: { '_id.orderId': -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$_id.warehouseId',
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
      $sort: { '_id.warehouseId': -1 },
    },
    {
      $group: {
        _id: {
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
        },
        warehouses: {
          $push: {
            warehouseId: '$_id.warehouseId',
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
      $sort: { itemId: -1 },
    },
    {
      $group: {
        _id: {
          warehouseId: '$warehouseId',
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
              $sum: { $multiply: ['$cost', '$planQuantity'] },
            },
            totalActualQuantity: { $sum: '$actualQuantity' },
            totalPriceActual: {
              $sum: { $multiply: ['$cost', '$actualQuantity'] },
            },
            cost: '$cost',
            note: '$note',
          },
        },
      },
    },
    {
      $sort: { '_id.warehouseId': -1 },
    },
  ]);
}
