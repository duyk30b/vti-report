import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import {
  OrderStatus,
  WarehouseTransferStatusEnum,
} from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportOrderItemRequest } from '@requests/report-order-items.request';
import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemInteface } from '@schemas/interface/report-order-item.interface';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { plus } from '@utils/common';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { DATE_FOMAT } from '@utils/constant';
@Injectable()
export class ReportOrderItemRepository extends BaseAbstractRepository<ReportOrderItem> {
  constructor(
    @InjectModel(ReportOrderItem.name)
    private readonly reportOrderItem: Model<ReportOrderItem>,
  ) {
    super(reportOrderItem);
  }
  saveMany(data: ReportOrderItemInteface[]) {
    return this.reportOrderItem.create(data);
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
          status: {
            $in: [
              OrderStatus.Completed,
              OrderStatus.InProgress,
              OrderStatus.Received,
            ],
          },
        });
        break;

      case ReportType.ORDER_TRANSFER_INCOMPLETED:
        condition['$and'].push({
          ebsNumber: { $eq: null },
        });
        condition['$and'].push({
          status: {
            $in: [
              WarehouseTransferStatusEnum.COMPLETED,
              WarehouseTransferStatusEnum.EXPORTED,
              WarehouseTransferStatusEnum.INCOLLECTING,
            ],
          },
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
