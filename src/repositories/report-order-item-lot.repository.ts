import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import {
  OrderStatus,
  WarehouseTransferStatusEnum,
} from '@enums/order-status.enum';
import { OrderType, WarehouseMovementTypeEnum } from '@enums/order-type.enum';
import { ActionType, ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemLotInteface } from '@schemas/interface/report-order-item-lot.interface';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { DATE_FOMAT } from '@utils/constant';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { INVENTORY_ADJUSTMENT_TYPE } from '@constant/common';

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

  saveMany(data: ReportOrderItemLotInteface[]) {
    return this.reportOrderItemLot.create(data);
  }
  async getReportItemInventory(request: ReportRequest): Promise<any[]> {
    const condition = {
      $and: [],
    };
    condition['$and'].push({
      orderType: { $in: [OrderType.IMPORT, OrderType.EXPORT] },
    });
    if (request?.dateFrom === request?.dateTo) {
      condition['$and'].push({
        $expr: {
          $eq: [
            { $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' } },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      if (request?.dateFrom) {
        condition['$and'].push({
          $expr: {
            $gte: [
              {
                $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
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
                $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
              },
              moment(request?.dateTo).format(DATE_FOMAT),
            ],
          },
        });
      }
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
              importIn: '$importIn',
              exportIn: '$exportIn',
              note: '$_id.note',
            },
          },
        },
      },
      {
        $sort: { warehouseCode: -1, itemCode: -1 },
      },
      {
        $unwind: { path: '$items' },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          itemCode: '$items.itemCode',
          itemName: '$items.itemName',
          unit: '$items.unit',
          lotNumber: '$items.lotNumber',
          storageCost: '$items.storageCost',
          importIn: '$items.importIn',
          exportIn: '$items.exportIn',
          note: '$items.note',
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

    if (request?.dateFrom === request?.dateTo) {
      condition['$and'].push({
        $expr: {
          $eq: [
            { $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' } },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      if (request?.dateFrom) {
        condition['$and'].push({
          $expr: {
            $gte: [
              {
                $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
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
                $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
              },
              moment(request?.dateTo).format(DATE_FOMAT),
            ],
          },
        });
      }
    }

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
              OrderStatus.Received,
              OrderStatus.InProgress,
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

    if (request?.dateFrom === request?.dateTo) {
      condition['$and'].push({
        $expr: {
          $eq: [
            { $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' } },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      if (request?.dateFrom) {
        condition['$and'].push({
          $expr: {
            $gte: [
              {
                $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
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
                $dateToString: { date: '$orderCreatedAt', format: '%Y-%m-%d' },
              },
              moment(request?.dateTo).format(DATE_FOMAT),
            ],
          },
        });
      }
    }

    switch (type) {
      case OrderType.IMPORT:
        condition['$and'].push({
          orderType: { $in: [type, OrderType.INVENTORY_ADJUSTMENTS_IMPORT] },
        });

      case OrderType.EXPORT:
        condition['$and'].push({
          orderType: { $in: [type, OrderType.INVENTORY_ADJUSTMENTS_EXPORT] },
        });
        break;

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
      case ReportType.SITUATION_IMPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [
              // OrderStatus.Received,
              OrderStatus.InProgress,
              OrderStatus.Completed,
            ],
          },
        });
        break;
      case ReportType.SITUATION_EXPORT_PERIOD:
        condition['$and'].push({
          status: {
            $in: [OrderStatus.Completed],
          },
        });
        break;
      case ReportType.SITUATION_TRANSFER:
        condition['$and'].push({
          status: {
            $in: [
              WarehouseTransferStatusEnum.COMPLETED,
              WarehouseTransferStatusEnum.EXPORTED,
              WarehouseTransferStatusEnum.RECEIVED,
            ],
          },
        });
        break;
        case ReportType.SITUATION_INVENTORY_PERIOD:
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
          companyCode: '$companyCode',
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
        totalRecievedQuantity: { $sum: '$receivedQuantity' },
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
          companyCode: '$_id.companyCode',
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
            recievedQuantity: { $sum: '$totalRecievedQuantity' },
            actualQuantity: { $sum: '$totalActualQuantity' },
            remainQuantity: {
              $subtract: [
                { $sum: '$totalRecievedQuantity' },
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
          companyCode: '$_id.companyCode',
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
    ...getCommonConditionSituation(OrderType.EXPORT),
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
            planQuantity: {
              $cond: {
                if: '$transactionItem.planQuantity',
                then: '$transactionItem.planQuantity',
                else: '$planQuantity',
              },
            },
            actualQuantity: {
              $cond: {
                if: '$transactionItem.actualQuantity',
                then: '$transactionItem.actualQuantity',
                else: '$actualQuantity',
              },
            },
            locatorCode: '$transactionItem.locatorCode',
            storageCost: '$storageCost',
            totalPrice: {
              $cond: {
                if: '$transactionItem.actualQuantity',
                then: {
                  $multiply: [
                    '$storageCost',
                    '$transactionItem.actualQuantity',
                  ],
                },
                else: {
                  $multiply: ['$storageCost', '$actualQuantity'],
                },
              },
            },
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
  const itemGroup = {
    itemCode: '$itemCode',
    itemName: '$itemName',
    lotNumber: '$lotNumber',
    accountDebt: '$accountDebt',
    accountHave: '$accountHave',
    unit: '$unit',
    actualQuantity: {
      $cond: {
        if: '$transactionItem.actualQuantity',
        then: '$transactionItem.actualQuantity',
        else: '$actualQuantity',
      },
    },
    locatorCode: '$transactionItem.locatorCode',
    storageCost: '$storageCost',
    totalPrice: {
      $cond: {
        if: '$transactionItem.actualQuantity',
        then: {
          $multiply: ['$storageCost', '$transactionItem.actualQuantity'],
        },
        else: {
          $multiply: ['$storageCost', '$actualQuantity'],
        },
      },
    },
  };

  return reportOrderItemLot.aggregate([
    { $match: condition },
    ...getCommonConditionSituation(OrderType.IMPORT),
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
            $cond: {
              if: {
                $and: [
                  { $eq: ['$status', OrderStatus.InProgress] }
                ],
              },
              then: {
                $cond: {
                  if: '$transactionItem',
                  then: itemGroup,
                  else: '$$REMOVE',
                },
              },
              else: itemGroup,
            },
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
            $cond: {
              if: { $gt: [{ $size: '$items' }, 0] },
              then: {
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
              else: '$$REMOVE',
            },
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
            $cond: {
              if: { $gt: [{ $size: '$orders' }, 0] },
              then: {
                value: '$_id.reason',
                totalPrice: { $sum: '$orders.totalPrice' },
                orders: '$orders',
              },
              else: '$$REMOVE',
            },
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
            $cond: {
              if: { $gt: [{ $size: '$reasons' }, 0] },
              then: {
                warehouseCode: '$_id.warehouseCode',
                warehouseName: '$_id.warehouseName',
                totalPrice: { $sum: '$reasons.totalPrice' },
                reasons: '$reasons',
              },
              else: '$$REMOVE',
            },
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
    ...getCommonConditionSituation(OrderType.TRANSFER),
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
            actualQuantity: {
              $cond: {
                if: '$transactionItem.actualQuantity',
                then: '$transactionItem.actualQuantity',
                else: '$actualQuantity',
              },
            },
            locatorCode: '$transactionItem.locatorCode',
            storageCost: '$storageCost',
            totalPrice: {
              $cond: {
                if: '$transactionItem.actualQuantity',
                then: {
                  $multiply: [
                    '$storageCost',
                    '$transactionItem.actualQuantity',
                  ],
                },
                else: {
                  $multiply: ['$storageCost', '$actualQuantity'],
                },
              },
            },
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

function getCommonConditionSituation(orderType: OrderType) {
  const condition = {
    $and: [
      { $eq: ['$itemCode', '$$itemCode'] },
      { $eq: ['$companyCode', '$$companyCode'] },
      { $eq: ['$warehouseCode', '$$warehouseCode'] },
      { $eq: ['$orderCode', '$$orderCode'] },
      { $eq: ['$lotNumber', '$$lotNumber'] },
    ],
  };
  switch (orderType) {
    case OrderType.TRANSFER:
      condition['$and'].push({
        $eq: ['$actionType', ActionType.EXPORT as any],
      });
      break;

    case OrderType.IMPORT:
      condition['$and'].push({
        $eq: ['$actionType', ActionType.IMPORT as any],
      });
      break;

    case OrderType.EXPORT:
    default:
      break;
  }

  return [
    {
      $lookup: {
        from: 'transaction-item',
        let: {
          companyCode: '$companyCode',
          itemCode: '$itemCode',
          orderCode: '$orderCode',
          warehouseCode: '$warehouseCode',
          lotNumber: '$lotNumber',
          status: '$status',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                ...condition,
              },
            },
          },
          {
            $project: {
              itemCode: 1,
              lotNumber: 1,
              locatorCode: 1,
              locatorName: 1,
              planQuantity: 1,
              actualQuantity: 1,
              movementType: 1,
              _id: 0,
            },
          },
          {
            $group: {
              _id: {
                itemCode: '$itemCode',
                lotNumber: '$lotNumber',
                locatorCode: '$locatorCode',
                locatorName: '$locatorName',
              },
              planQuantity: { $sum: '$planQuantity' },
              actualQuantity: { $sum: '$actualQuantity' },
            },
          },
          {
            $project: {
              itemCode: '$_id.itemCode',
              lotNumber: '$_id.lotNumber',
              locatorCode: '$_id.locatorCode',
              locatorName: '$_id.locatorName',
              planQuantity: 1,
              actualQuantity: 1,
              _id: 0,
            },
          },
        ],
        as: 'transactionItem',
      },
    },
    {
      $unwind: { path: '$transactionItem', preserveNullAndEmptyArrays: true },
    },
  ];
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
