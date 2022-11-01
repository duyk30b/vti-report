import { ResponseCodeEnum } from '@core/response-code.enum';
import { ResponseBuilder } from '@core/utils/response-builder';
import { ResponsePayload } from '@core/utils/response-payload';
import { Inject, Injectable } from '@nestjs/common';
import { DailyItemLocatorStockRepository } from '@repositories/daily-item-locator-stock.repository';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyWarehouseItemStockRepository } from '@repositories/daily-warehouse-item-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { ReportOrderItemRepository } from '@repositories/report-order-item.repository';
import { ReportOrderRepository } from '@repositories/report-order.repository';
import { TransactionItemRepository } from '@repositories/transaction-item.repository';
import {
  SyncDailyReportRequest,
  SyncDailyStockRequest,
} from '@requests/sync-daily.request';
import { SyncItemStockLocatorByDate } from '@requests/sync-item-stock-locator-by-date';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { SyncTransactionRequest } from '@requests/sync-transaction.request';
@Injectable()
export class SyncService {
  constructor(
    @Inject('DailyWarehouseItemStockRepository')
    private readonly dailyWarehouseItemStockRepository: DailyWarehouseItemStockRepository,

    @Inject('DailyItemLocatorStockRepository')
    private readonly dailyItemLocatorStockRepository: DailyItemLocatorStockRepository,

    @Inject('DailyLotLocatorStockRepository')
    private readonly dailyLotLocatorStockRepository: DailyLotLocatorStockRepository,

    @Inject('ReportOrderRepository')
    private readonly reportOrderRepository: ReportOrderRepository,

    @Inject('ReportOrderItemRepository')
    private readonly reportOrderItemRepository: ReportOrderItemRepository,

    @Inject('ReportOrderItemLotRepository')
    private readonly reportOrderItemLotRepository: ReportOrderItemLotRepository,

    @Inject('TransactionItemRepository')
    private readonly transactionItemRepository: TransactionItemRepository,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async syncDailyStock(
    request: SyncDailyStockRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      await Promise.all([
        this.dailyWarehouseItemStockRepository.createMany(
          request?.dailyWarehouseItems,
        ),
        this.dailyItemLocatorStockRepository.createMany(
          request?.dailyWarehouseItems,
        ),
        this.dailyLotLocatorStockRepository.createMany(
          request?.dailyWarehouseItems,
        ),
      ]);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (e) {
      console.log(e);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async syncDailyReport(
    request: SyncDailyReportRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      await Promise.all([
        this.reportOrderRepository.createMany(request?.reportOrders),
        this.reportOrderItemRepository.createMany(request?.reportOrders),
        this.reportOrderItemLotRepository.createMany(request?.reportOrders),
      ]);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (e) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async syncTransaction(
    request: SyncTransactionRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      await this.transactionItemRepository.createOne(request);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (e) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async saveItemStockWarehouseLocatorByDate(
    data: SyncItemStockLocatorByDate[],
  ): Promise<any> {
    const itemStockLocatorEntities = data.map((dailyItemStockLocator) =>
      this.dailyItemLocatorStockRepository.createEntity(dailyItemStockLocator),
    );

    this.dailyItemLocatorStockRepository.create(itemStockLocatorEntities);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
