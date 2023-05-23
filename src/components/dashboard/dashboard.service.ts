import { ConfigService } from '@core/config/config.service';
import { ResponseCodeEnum } from '@core/response-code.enum';
import { ResponseBuilder } from '@core/utils/response-builder';
import { Inject, Injectable } from '@nestjs/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportType } from './dashboard.constant';
import * as moment from 'moment';
import { ReportItemStockHistoriesRequestDto } from './dto/request/report-item-stock-histories.request.dto';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';
import { RangeDate } from './dto/request/report-by-type.response';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { ReportItemHistoriesResponseDto } from './dto/response/report-item-histories.response.dto';
import { plus } from '@utils/common';
import { DailyItemWarehouseStockPriceRepository } from '@repositories/daily-item-warehouse-stock-price.repository';

@Injectable()
export class DashboardService implements DashboardServiceInterface {
  constructor(
    private readonly i18n: I18nRequestScopeService,

    @Inject('ConfigServiceInterface')
    private readonly configService: ConfigService,

    @Inject(DailyLotLocatorStockRepository.name)
    private dailyLotLocatorStockRepository: DailyLotLocatorStockRepository,

    @Inject(DailyItemWarehouseStockPriceRepository.name)
    private dailyItemWarehouseStockPriceRepository: DailyItemWarehouseStockPriceRepository,
  ) {}

  async reportItemStockHistories(
    request: ReportItemStockHistoriesRequestDto,
  ): Promise<any> {
    const { reportType, from, to } = request;
    const { listRangeDate, startDate, endDate } = this.getRangeDateByDateType(
      reportType,
      from,
      to,
    );
    const data =
      await this.dailyItemWarehouseStockPriceRepository.getItemStockHistories(
        startDate,
        endDate,
        request,
      );
    const reportData: ReportItemHistoriesResponseDto[] = [];
    listRangeDate.forEach((rangeDate) => {
      const { startDate: startRangeDate, endDate: endRangeDate } = rangeDate;
      const rangeDateStock = data.filter(
        (e) =>
          moment(e.reportDate).isSameOrAfter(
            moment(startRangeDate, 'YYYYMMDD'),
            'day',
          ) &&
          moment(e.reportDate).isSameOrBefore(
            moment(endRangeDate, 'YYYYMMDD'),
            'day',
          ),
      );
      let quantity = 0;
      let amount = 0;
      rangeDateStock.forEach((item) => {
        quantity = plus(quantity, item.quantity);
        amount = plus(amount, item.amount);
      });
      reportData.push({
        reportType: reportType,
        tag: rangeDate.tag,
        quantity: quantity,
        amount: amount,
        rangeDate: this.getRangeDate(startRangeDate, endRangeDate, reportType),
      } as ReportItemHistoriesResponseDto);
    });
    return new ResponseBuilder(reportData)
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('error.SUCCESS'))
      .build();
  }

  private getRangeDate(
    startDate: string,
    endDate: string,
    reportType: ReportType,
  ): string {
    return reportType === ReportType.DAY
      ? `${moment(startDate, 'YYYYMMDD').format('DD/MM/y')}`
      : `${moment(startDate, 'YYYYMMDD').format('DD/MM/y')}-${moment(
          endDate,
          'YYYYMMDD',
        ).format('DD/MM/y')}`;
  }

  private getRangeDateByDateType(
    reportType: number,
    startDate?: Date,
    endDate?: Date,
  ): {
    listRangeDate: RangeDate[];
    startDate: Date;
    endDate: Date;
  } {
    const listRangeDate: RangeDate[] = [];
    let unit: 'day' | 'month' | 'quarter' = 'day';
    switch (reportType) {
      case ReportType.MONTH:
        unit = 'month';
        break;
      case ReportType.QUARTER:
        unit = 'quarter';
        break;
      default:
        break;
    }
    const from = startDate
      ? moment(startDate)
      : reportType === ReportType.MONTH
      ? moment().month(moment().month()).startOf('month')
      : reportType === ReportType.QUARTER
      ? moment().quarter(moment().quarter()).startOf('quarter')
      : moment().isoWeek(moment().isoWeek()).startOf('isoWeek');

    const to = endDate
      ? moment(endDate)
      : reportType === ReportType.MONTH
      ? moment().month(moment().month()).endOf('month')
      : reportType === ReportType.QUARTER
      ? moment().quarter(moment().quarter()).endOf('quarter')
      : moment().isoWeek(moment().isoWeek()).endOf('isoWeek');
    let tag = 30;
    for (
      let date = to.clone();
      date.isSameOrAfter(from, unit) && listRangeDate.length < 30;
      date = date.clone().endOf(unit).subtract(1, unit)
    ) {
      let startUnit = date.clone().startOf(unit).format('YYYYMMDD');
      if (from.isSameOrAfter(startUnit)) {
        startUnit = from.format('YYYYMMDD');
      }
      let endUnit = date.clone().endOf(unit);
      if (to.isSameOrBefore(endUnit)) {
        endUnit = to;
      }
      listRangeDate.push(
        new RangeDate(
          reportType,
          `${tag}`,
          startUnit,
          endUnit.format('YYYYMMDD'),
        ),
      );
      tag--;
    }
    return {
      listRangeDate: listRangeDate.reverse(),
      startDate: from.toDate(),
      endDate: to.toDate(),
    };
  }
}
