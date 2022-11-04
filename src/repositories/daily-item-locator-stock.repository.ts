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
    dailyItemStockLocator: SyncItemStockLocatorByDate,
  ): DailyItemLocatorStock {
    const document = new this.dailyItemLocatorStock();
    document.itemName = dailyItemStockLocator?.itemName;
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.warehouseName = dailyItemStockLocator?.warehouseName;
    document.warehouseCode = dailyItemStockLocator?.warehouseCode;
    document.locatorName = dailyItemStockLocator?.locatorName;
    document.locatorCode = dailyItemStockLocator?.locatorCode;
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
      for (const dailyItemLocatorStock of dailyWarehouseItemRequest.dailyItemLocatorStocks) {
        const document = new this.dailyItemLocatorStock();
        Object.assign(
          document,
          dailyWarehouseItemRequest,
          dailyItemLocatorStock,
        );
        document.stockQuantity = this.sumItem(
          dailyItemLocatorStock,
          'stockQuantity',
        );
        document.storageCost = this.sumItem(
          dailyItemLocatorStock,
          'storageCost',
        );
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
