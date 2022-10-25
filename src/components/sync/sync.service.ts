import { ResponseCodeEnum } from '@core/response-code.enum';
import { ResponseBuilder } from '@core/utils/response-builder';
import { ResponsePayload } from '@core/utils/response-payload';
import { Inject, Injectable } from '@nestjs/common';
import { DailyItemLocatorStockRepository } from '@repositories/daily-item-locator-stock.repository';
import { SyncItemStockLocatorByDate } from '@requests/sync-item-stock-locator-by-date';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class SyncService {
  constructor(
    private readonly i18n: I18nRequestScopeService,

    @Inject('DailyItemLocatorStockRepository')
    private dailyItemLocatorStockRepository: DailyItemLocatorStockRepository,
  ) {}

  async sync(): Promise<ResponsePayload<any>> {
    try {
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
    data: SyncItemStockLocatorByDate[]
  ): Promise<any> {
    const itemStockLocatorEntities = data.map(dailyItemStockLocator => (
      this.dailyItemLocatorStockRepository.createEntity(dailyItemStockLocator)
    ));

    this.dailyItemLocatorStockRepository.create(itemStockLocatorEntities);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
