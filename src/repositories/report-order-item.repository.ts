import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportOrderItemRequest } from '@requests/report-order-items.request';
import { ReportRequest } from '@requests/report.request';
import { ReportOrderRequest } from '@requests/sync-daily.request';
import { ReportOrderItemInteface } from '@schemas/interface/report-order-item.interface';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { plus } from '@utils/common';
import { ClientSession } from 'mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReportOrderItemRepository extends BaseAbstractRepository<ReportOrderItem> {
  constructor(
    @InjectModel(ReportOrderItem.name)
    private readonly reportOrderItem: Model<ReportOrderItem>,
  ) {
    super(reportOrderItem);
  }

  async save(data: ReportOrderItemInteface) {
    const document = new this.reportOrderItem();
    Object.assign(document, data);
    await document.save();
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
      case ReportType.ORDER_EXPORT_INCOMPLETED:
        condition['$and'].push({
          ebsNumber: { $eq: null },
        });

        break;
      case ReportType.ORDER_IMPORT_INCOMPLETED:
        condition['$and'].push({
          ebsNumber: { $eq: null },
        });
        condition['$and'].push({
          status: { $eq: OrderStatus.Completed },
        });
        break;

      case ReportType.ORDER_TRANSFER_INCOMPLETED:
        condition['$and'].push({
          ebsNumber: { $eq: null },
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
