import { UserService } from '@components/user/user.service';
import { ResponseCodeEnum } from '@core/response-code.enum';
import { ResponseBuilder } from '@core/utils/response-builder';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DailyReportStockRepository } from '@repositories/daily-report-stock.repository';
import { sleep } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { SyncDailyReportStockRequestBody } from './dto/request/sync-daily-report-stock.request';
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @Inject('DailyReportStockRepository')
    private readonly dailyReportStockRepository: DailyReportStockRepository,

    private readonly i18n: I18nRequestScopeService,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,
  ) {}

  async syncDailyReportStock(
    request: SyncDailyReportStockRequestBody,
  ): Promise<any> {
    const { data } = request;
    try {
      const bulkWriteOptions = data
        .map((item) => {
          if (!item.warehouseCode) return null;
          return {
            updateOne: {
              filter: {
                companyCode: item.companyCode,
                companyName: item.companyName,
                warehouseCode: item.warehouseCode,
                warehouseName: item.warehouseName,
                locatorCode: item.locatorCode,
                locatorName: item.locatorName,
                lotNumber: item.lotNumber,
                itemCode: item.itemCode,
                productionDate: item.productionDate,
                storageDate: item.storageDate,
                reportDate: item.reportDate,
              },
              update: item,
              upsert: true,
            },
          };
        })
        .filter((item) => item !== null);

      const limit = 200;
      const page = Math.ceil(bulkWriteOptions.length / limit);
      for (let currentPage = 0; currentPage < page; currentPage++) {
        const dataStart = currentPage * limit;
        const dataEnd = (currentPage + 1) * limit;
        const documents = bulkWriteOptions.slice(dataStart, dataEnd);
        await this.dailyReportStockRepository.bulkWrite(documents);
        if (currentPage !== page - 1) {
          await sleep(200);
        }
      }

      console.info('SYNC DAILY REPORT STOCK SUCCESS:', new Date());
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (error) {
      console.error('SYNC DAILY REPORT STOCK ERROR:', error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }
}
