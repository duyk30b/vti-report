import { Inject, Injectable } from '@nestjs/common';
import { ReportRequest } from '../../requests/report.request';
import { ReportResponse } from '../../responses/report.response';
import { ReportTypeEnum } from '@enums/report-type.enum';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { UserService } from '@components/user/user.service';
import { WarehouseServiceInterface } from '@components/warehouse/interface/warehouse.service.interface';
import { DailyReportStockRepository } from '@repositories/daily-report-stock.repository';
import * as moment from 'moment';
@Injectable()
export class ExportService {
  constructor(
    @Inject(DailyReportStockRepository.name)
    private dailyReportStockRepository: DailyReportStockRepository,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('WarehouseServiceInterface')
    private readonly warehouseServiceInterface: WarehouseServiceInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getReport(request: ReportRequest): Promise<ReportResponse> {
    let dataReturn;
    try {
      switch (request.reportType) {
        case ReportTypeEnum.ITEM_STOCK:
          dataReturn = await this.reportItemStock(request);
          break;

        default:
          dataReturn = null;
          break;
      }
      return dataReturn;
    } catch (e) {
      console.log(e);
      return { error: e } as any;
    }
  }

  async reportItemStock(request: ReportRequest): Promise<ReportResponse> {
    let data: any = [];
    if (moment(request.dateFrom).isSame(moment(), 'day')) {
      data = await this.dailyReportStockRepository.reportItemStockRealtime(
        request,
      );
    } else {
      data = await this.dailyReportStockRepository.reportItemStock(request);
    }

    return data;
  }
}
