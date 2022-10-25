import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  DailyItemLocatorStockRequest,
  DailyWarehouseItemRequest,
} from '@requests/sync-daily.request';
import { SyncItemStockLocatorByDate } from '@requests/sync-item-stock-locator-by-date';
import { DailyItemLocatorStock } from '@schemas/daily-item-locator-stock.schema';
import { plus } from '@utils/common';
import { Model } from 'mongoose';

@Injectable()
export class DailyItemLocatorStockRepository extends BaseAbstractRepository<DailyItemLocatorStock> {
  constructor(
    @InjectModel(DailyItemLocatorStock.name)
    private readonly dailyItemLocatorStock: Model<DailyItemLocatorStock>,
  ) {
    super(dailyItemLocatorStock);
  }

  createEntity(
    dailyItemStockLocator: SyncItemStockLocatorByDate
  ): DailyItemLocatorStock {
    const document = new this.dailyItemLocatorStock();
    document.itemId = dailyItemStockLocator?.itemId;
    document.itemName = dailyItemStockLocator?.itemName;
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.warehouseId = dailyItemStockLocator?.warehouseId;
    document.warehouseName = dailyItemStockLocator?.warehouseName;
    document.warehouseCode = dailyItemStockLocator?.warehouseCode;
    document.locatorId = dailyItemStockLocator?.locatorId;
    document.locatorName = dailyItemStockLocator?.locatorName;
    document.locatorCode = dailyItemStockLocator?.locatorCode;
    document.companyId = dailyItemStockLocator?.companyId;
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
      for (const dailyItemLocatorStock of dailyWarehouseItemRequest.dailyItemLocatorStocks) {
        const document = new this.dailyItemLocatorStock();

        document.itemId = dailyWarehouseItemRequest?.itemId;
        document.itemName = dailyWarehouseItemRequest?.itemName;
        document.itemCode = dailyWarehouseItemRequest?.itemCode;

        document.warehouseId = dailyWarehouseItemRequest?.warehouseId;
        document.warehouseName = dailyWarehouseItemRequest?.warehouseName;
        document.warehouseCode = dailyWarehouseItemRequest?.warehouseCode;

        document.reportDate = dailyWarehouseItemRequest?.reportDate;
        document.minInventoryLimit =
          dailyWarehouseItemRequest?.minInventoryLimit;
        document.inventoryLimit = dailyWarehouseItemRequest?.inventoryLimit;
        document.origin = dailyWarehouseItemRequest?.origin;
        document.stockQuantity = this.sumItem(
          dailyItemLocatorStock,
          'stockQuantity',
        );
        document.storageCost = this.sumItem(
          dailyItemLocatorStock,
          'storageCost',
        );
        document.companyId = dailyWarehouseItemRequest?.companyId;
        document.companyName = dailyWarehouseItemRequest?.companyName;
        document.locatorId = dailyItemLocatorStock?.locatorId;
        document.locatorName = dailyItemLocatorStock?.locatorName;
        document.locatorCode = dailyItemLocatorStock?.locatorCode;
        document.companyAddress = dailyWarehouseItemRequest?.companyAddress;
        document.note = dailyWarehouseItemRequest?.note;
        await document.save();
      }
    }
  }

  private sumItem(
    dailyItemLocatorStockRequest: DailyItemLocatorStockRequest,
    field: string,
  ) {
    let quantity = 0;
    dailyItemLocatorStockRequest?.dailyLotLocatorStocks.forEach(
      (dailyLotLocatorStock) => {
        quantity = plus(quantity || 0, dailyLotLocatorStock[field] || 0);
      },
    );

    return quantity;
  }
}
