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
          document.orderId = reportOrderRequest?.orderId;
          document.orderName = reportOrderRequest.orderName;
          document.orderCreatedAt = reportOrderRequest.orderCreatedAt;
          document.itemId = reportOrderItem?.itemId;
          document.itemName = reportOrderItem.itemName;
          document.itemCode = reportOrderItem.itemCode;
          document.lotNumber = reportOrderItemLot?.lotNumber;
          document.warehouseId = reportOrderRequest?.warehouseId;
          document.warehouseName = reportOrderRequest.warehouseName;
          document.warehouseCode = reportOrderRequest.warehouseCode;
          document.orderType = reportOrderRequest.orderType;
          document.actionType = reportOrderRequest.actionType;
          document.planDate = reportOrderRequest.planDate;
          document.status = reportOrderRequest.status;
          document.completedAt = reportOrderRequest.completedAt;
          document.companyId = reportOrderRequest.companyId;
          document.ebsId = reportOrderRequest.ebsId;
          document.constructionId = reportOrderRequest.constructionId;
          document.constructionCode = reportOrderRequest.constructionCode;
          document.constructionName = reportOrderRequest.constructionName;
          document.unit = reportOrderRequest.unit;
          document.performerId = reportOrderRequest.performerId;
          document.performerName = reportOrderRequest.performerName;
          document.planQuantity = reportOrderItemLot?.planQuantity;
          document.actualQuantity = reportOrderItemLot?.actualQuantity;
          document.receivedQuantity = reportOrderItemLot?.receivedQuantity;
          document.storedQuantity = reportOrderItemLot?.storedQuantity;
          document.collectedQuantity = reportOrderItemLot?.collectedQuantity;
          document.exportedQuantity = reportOrderItemLot?.exportedQuantity;
          document.reason = reportOrderItemLot?.reason;
          document.explain = reportOrderItemLot?.explain;
          document.note = reportOrderItemLot?.note;
          document.cost = reportOrderItemLot?.cost;
          document.locationId = reportOrderItemLot?.locationId;
          document.locationCode = reportOrderItemLot?.locationCode;
          document.locationName = reportOrderItemLot?.locationName;
          document.qrCode = reportOrderRequest.qrCode;
          document.companyName = reportOrderRequest.companyName;
          document.companyAddress = reportOrderRequest.companyAddress;
          document.warehouseTargetId = reportOrderRequest.warehouseTargetId;
          document.warehouseTargetCode = reportOrderRequest.warehouseTargetCode;
          document.warehouseTargetName = reportOrderRequest.warehouseTargetName;
          document.purpose = reportOrderRequest.purpose;
          document.postCode = reportOrderRequest.postCode;
          document.contract = reportOrderRequest.contract;
          document.providerId = reportOrderRequest.providerId;
          document.receiveDepartmentId = reportOrderRequest.receiveDepartmentId;
          document.providerCode = reportOrderRequest.providerCode;
          document.receiveDepartmentCode =
            reportOrderRequest.receiveDepartmentCode;
          document.providerName = reportOrderRequest.providerName;
          document.receiveDepartmentName =
            reportOrderRequest.receiveDepartmentName;
          document.description = reportOrderRequest.description;
          document.accountId = reportOrderRequest.accountId;
          document.accountCode = reportOrderRequest.accountCode;
          document.accountName = reportOrderRequest.accountName;
          document.account = reportOrderRequest.account;
          document.accountDebt = reportOrderRequest.accountDebt;
          document.accountHave = reportOrderRequest.accountHave;
          document.proposalExport = reportOrderRequest.proposalExport;

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
        orderCreatedAt: { $gte: request?.dateFrom },
      });

    if (request?.dateTo)
      condition['$and'].push({
        orderCreatedAt: { $lte: request?.dateTo },
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
            $eq:
              OrderStatus.RECEIVED ||
              OrderStatus.RECEIVING ||
              OrderStatus.STORING ||
              OrderStatus.IMPORT_COMPLETED,
          },
        });
        break;
      case ReportType.SITUATION_EXPORT_PERIOD:
        condition['$and'].push({
          status: {
            $eq:
              OrderStatus.EXPORTED ||
              OrderStatus.EXPORTING ||
              OrderStatus.EXPORT_COMPLETED ||
              OrderStatus.NOT_YET_EXPORT,
          },
        });
        break;
      case ReportType.SITUATION_TRANSFER:
        condition['$and'].push({
          status: {
            $eq:
              OrderStatus.IMPORTED ||
              OrderStatus.EXPORTED ||
              OrderStatus.TRANSFER_COMPLETED,
          },
        });
        break;
      default:
        break;
    }

    return this.reportOrderItemLot
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1 })
      .lean();
  }
}
