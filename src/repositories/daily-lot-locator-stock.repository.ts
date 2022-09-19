import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemRequest } from '@requests/sync-daily.request';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { Model } from 'mongoose';

@Injectable()
export class DailyLotLocatorStockRepository extends BaseAbstractRepository<DailyLotLocatorStock> {
  constructor(
    @InjectModel(DailyLotLocatorStock.name)
    private readonly dailyLotLocatorStock: Model<DailyLotLocatorStock>,
  ) {
    super(dailyLotLocatorStock);
  }

  async createMany(
    dailyWarehouseItemRequests: DailyWarehouseItemRequest[],
  ): Promise<void> {
    for (const dailyWarehouseItemRequest of dailyWarehouseItemRequests) {
      for (const dailyItemLocatorStock of dailyWarehouseItemRequest.dailyItemLocatorStocks) {
        for (const dailyLotLocatorStock of dailyItemLocatorStock.dailyLotLocatorStocks) {
          const document = new this.dailyLotLocatorStock();
          document.itemId = dailyWarehouseItemRequest?.itemId;
          document.itemName = dailyWarehouseItemRequest?.itemName;
          document.itemCode = dailyWarehouseItemRequest?.itemCode;
          document.warehouseId = dailyWarehouseItemRequest?.warehouseId;
          document.warehouseName = dailyWarehouseItemRequest?.warehouseName;
          document.warehouseCode = dailyWarehouseItemRequest?.warehouseCode;
          document.reportDate = dailyWarehouseItemRequest?.reportDate;
          document.stockQuantity = dailyLotLocatorStock?.stockQuantity;
          document.storageCost = dailyLotLocatorStock?.storageCost;
          document.companyId = dailyWarehouseItemRequest?.companyId;
          document.locatorId = dailyItemLocatorStock?.locatorId;
          document.locatorName = dailyItemLocatorStock?.locatorName;
          document.locatorCode = dailyItemLocatorStock?.locatorCode;
          document.lotNumber = dailyLotLocatorStock?.lotNumber;
          document.minInventoryLimit =
            dailyWarehouseItemRequest?.minInventoryLimit;
          document.inventoryLimit = dailyWarehouseItemRequest?.inventoryLimit;
          document.companyName = dailyWarehouseItemRequest?.companyName;
          document.companyAddress = dailyWarehouseItemRequest?.companyAddress;
          document.origin = dailyWarehouseItemRequest?.origin;
          document.note = dailyWarehouseItemRequest?.note;

          await document.save();
        }
      }
    }
  }

  async getReports(request: ReportRequest): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };

    if (request?.dateTo)
      condition['$and'].push({
        reportDate: { $eq: request?.dateTo },
      });
    if (request?.companyId)
      condition['$and'].push({
        companyId: { $eq: request?.companyId },
      });
    if (request?.warehouseId)
      condition['$and'].push({
        warehouseId: { $eq: request?.warehouseId },
      });

    return this.dailyLotLocatorStock
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1, lotNumber: 1, stockQuantity: 1 })
      .lean();
  }

  async getReportsByDate(
    request: ReportRequest,
    date: Date,
  ): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };

    if (date)
      condition['$and'].push({
        reportDate: { $eq: date },
      });

    if (request?.companyId)
      condition['$and'].push({
        companyId: { $eq: request?.companyId },
      });
    if (request?.warehouseId)
      condition['$and'].push({
        warehouseId: { $eq: request?.warehouseId },
      });

    return this.dailyLotLocatorStock
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1, lotNumber: 1, stockQuantity: 1 })
      .lean();
  }

  async getReportAgeOfItemStock(
    request: ReportRequest,
    dateFrom: string,
    dateTo: string,
  ): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };
    if (dateFrom)
      condition['$and'].push({
        reportDate: { $gte: dateFrom },
      });
    if (dateTo)
      condition['$and'].push({
        reportDate: { $lte: dateTo },
      });

    if (request?.companyId)
      condition['$and'].push({
        companyId: { $eq: request?.companyId },
      });
    if (request?.warehouseId)
      condition['$and'].push({
        warehouseId: { $eq: request?.warehouseId },
      });

    return this.dailyLotLocatorStock
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1, lotNumber: 1, stockQuantity: 1 })
      .lean();
  }
}
