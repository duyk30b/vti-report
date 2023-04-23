import { SyncDailyItemStockLocatorRequestDto } from '@components/sync/dto/request/sync-daily-item-stock-warehouse.request.dto';
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
    dailyItemStockLocator: SyncDailyItemStockLocatorRequestDto,
  ): DailyItemLocatorStock {
    const document = new this.dailyItemLocatorStock();
    document.itemName = dailyItemStockLocator?.itemName;
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.unit = dailyItemStockLocator.unit;
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
