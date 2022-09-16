import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import {
  ReportOrderItemRequest,
  ReportOrderRequest,
} from '@requests/sync-daily.request';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { plus } from '@utils/common';
import { Model } from 'mongoose';

@Injectable()
export class ReportOrderItemRepository extends BaseAbstractRepository<ReportOrderItem> {
  constructor(
    @InjectModel(ReportOrderItem.name)
    private readonly reportOrderItem: Model<ReportOrderItem>,
  ) {
    super(reportOrderItem);
  }

  async createMany(reportOrderRequests: ReportOrderRequest[]): Promise<void> {
    for (const reportOrderRequest of reportOrderRequests) {
      for (const reportOrderItem of reportOrderRequest.reportOrderItems) {
        const document = new this.reportOrderItem();
        document.orderId = reportOrderRequest?.orderId;
        document.orderName = reportOrderRequest.orderName;
        document.orderCreatedAt = reportOrderRequest.orderCreatedAt;
        document.itemId = reportOrderItem.itemId;
        document.itemName = reportOrderItem.itemName;
        document.itemCode = reportOrderItem.itemCode;
        document.warehouseId = reportOrderRequest.warehouseId;
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

        document.cost = this.sumItem(reportOrderItem, 'cost');
        document.planQuantity = this.sumItem(reportOrderItem, 'planQuantity');
        document.actualQuantity = this.sumItem(
          reportOrderItem,
          'actualQuantity',
        );
        document.receivedQuantity = this.sumItem(
          reportOrderItem,
          'receivedQuantity',
        );
        document.storedQuantity = this.sumItem(
          reportOrderItem,
          'storedQuantity',
        );
        document.collectedQuantity = this.sumItem(
          reportOrderItem,
          'collectedQuantity',
        );
        document.exportedQuantity = this.sumItem(
          reportOrderItem,
          'exportedQuantity',
        );
        await document.save();
      }
    }
  }

  private sumItem(
    reportOrderItemRequest: ReportOrderItemRequest,
    field: string,
  ): number {
    let quantity = 0;
    reportOrderItemRequest?.reportOrderItemLots.forEach(
      (reportOrderItemLot) => {
        quantity = plus(quantity || 0, reportOrderItemLot[field] || 0);
      },
    );
    return quantity;
  }

  async getReports(
    request: ReportRequest,
    type: OrderType,
  ): Promise<ReportOrderItem[]> {
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
      case ReportType.ORDER_EXPORT_INCOMPLETED:
        condition['$and'].push({
          ebsId: { $eq: null },
        });

        break;
      case ReportType.ORDER_IMPORT_INCOMPLETED:
        condition['$and'].push({
          ebsId: { $eq: null },
        });
        condition['$and'].push({
          status: { $eq: OrderStatus.IMPORTED },
        });
        break;

      case ReportType.ORDER_TRANSFER_INCOMPLETED:
        condition['$and'].push({
          ebsId: { $eq: null },
        });
        break;

      default:
        break;
    }

    return this.reportOrderItem
      .find(condition)
      .sort({ warehouseCode: 1, orderCode: 1, itemCode: 1 })
      .lean();
  }
}
