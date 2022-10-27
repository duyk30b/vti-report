import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportOrderItemRequest } from '@requests/report-order-items.request';
import { ReportRequest } from '@requests/report.request';
import { ReportOrderRequest } from '@requests/sync-daily.request';
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
        Object.assign(document, reportOrderRequest, reportOrderItem);
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
        quantity = plus(quantity, reportOrderItemLot[field] || 0);
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
      .sort({ warehouseCode: -1, orderCode: -1, itemCode: -1 })
      .lean();
  }
}
