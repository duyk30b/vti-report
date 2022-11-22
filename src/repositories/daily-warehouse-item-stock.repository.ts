import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemRequest } from '@requests/sync-daily.request';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { plus } from '@utils/common';
import * as moment from 'moment';
import { Model } from 'mongoose';

@Injectable()
export class DailyWarehouseItemStockRepository extends BaseAbstractRepository<DailyWarehouseItemStock> {
  constructor(
    @InjectModel(DailyWarehouseItemStock.name)
    private readonly dailyWarehouseItemStock: Model<DailyWarehouseItemStock>,
  ) {
    super(dailyWarehouseItemStock);
  }

  async createMany(
    dailyWarehouseItemRequests: DailyWarehouseItemRequest[],
  ): Promise<void> {
    for (const dailyWarehouseItemRequest of dailyWarehouseItemRequests) {
      const document = new this.dailyWarehouseItemStock();
      Object.assign(document, dailyWarehouseItemRequest);

      await document.save();
    }
  }

  private sumWarehouse(
    dailyWarehouseItemRequest: DailyWarehouseItemRequest,
    field: string,
  ) {
    let quantity = 0;
    dailyWarehouseItemRequest?.dailyItemLocatorStocks.forEach(
      (dailyItemLocatorStock) => {
        dailyItemLocatorStock?.dailyLotLocatorStocks.forEach(
          (dailyLotLocatorStock) => {
            quantity = plus(quantity || 0, dailyLotLocatorStock[field] || 0);
          },
        );
      },
    );
    return quantity;
  }

  getCommontCondition(request: ReportRequest) {
    const condition = {
      $and: [],
    };
    if (request?.dateFrom) {
      const today = moment(request?.dateFrom).startOf('day');
      const tomorrow = moment(today).endOf('day');
      condition['$and'].push({
        reportDate: { $gte: today, $lte: tomorrow },
      });
    }

    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });
    return condition;
  }

  async getReports(request: ReportRequest): Promise<DailyWarehouseItemStock[]> {
    let condition = this.getCommontCondition(request);

    switch (request?.reportType) {
      case ReportType.ITEM_INVENTORY_BELOW_SAFE:
        condition['$and'].push({
          $expr: {
            $lt: [`$stockQuantity`, `$inventoryLimit`],
          },
        });
        break;
      case ReportType.ITEM_INVENTORY_BELOW_MINIMUM:
        condition['$and'].push({
          $expr: {
            $lt: [`$stockQuantity`, `$minInventoryLimit`],
          },
        });
        break;

      default:
        break;
    }

    if (request?.dateFrom) {
      const today = moment(request?.dateFrom).startOf('day');
      const tomorrow = moment(today).endOf('day');
      condition['$and'].push({
        reportDate: { $gte: today, $lte: tomorrow },
      });
    }

    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    return this.dailyWarehouseItemStock
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1, stockQuantity: 1 })
      .lean();
  }
}
