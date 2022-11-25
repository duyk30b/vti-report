import { SyncDailyItemStockWarehouseRequestDto } from '@components/sync/dto/request/sync-daily-item-stock-warehouse.request.dto';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemRequest } from '@requests/sync-daily.request';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { getTimezone, plus } from '@utils/common';
import { DATE_FOMAT, FORMAT_DATE } from '@utils/constant';
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

  createEntity(
    dailyItemStockLocator: SyncDailyItemStockWarehouseRequestDto,
  ): DailyWarehouseItemStock {
    const document = new this.dailyWarehouseItemStock();
    document.itemName = dailyItemStockLocator?.itemName;
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.warehouseName = dailyItemStockLocator?.warehouseName;
    document.warehouseCode = dailyItemStockLocator?.warehouseCode;
    document.companyCode = dailyItemStockLocator?.companyCode;
    document.companyName = dailyItemStockLocator?.companyName;
    document.companyAddress = dailyItemStockLocator?.companyAddress;
    document.reportDate = dailyItemStockLocator?.reportDate;
    document.stockQuantity = dailyItemStockLocator?.stockQuantity;
    return document;
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

  async getReports(request: ReportRequest): Promise<DailyWarehouseItemStock[]> {
    const condition = {
      $and: [],
    };

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

    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    if (request?.dateFrom == getTimezone(undefined, FORMAT_DATE)) {
      const prevDate = new Date(request?.dateFrom);
      prevDate.setDate(prevDate.getDate() - 1);
      condition['$and'].push({
        $expr: {
          $eq: [
            { $dateToString: { date: '$reportDate', format: '%Y-%m-%d' } },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      condition['$and'].push({
        $expr: {
          $eq: [
            { $dateToString: { date: '$reportDate', format: '%Y-%m-%d' } },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    }

    return this.dailyWarehouseItemStock
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1, stockQuantity: 1 })
      .lean();
  }
}
