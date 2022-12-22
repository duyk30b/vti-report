import { Controller, Get, Inject, Query } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { ReportItemStockHistoriesRequestDto } from './dto/request/report-item-stock-histories.request.dto';
import { DashboardServiceInterface } from './interface/dashboard.service.interface';
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('DashboardServiceInterface')
    private readonly dashboardService: DashboardServiceInterface,
  ) {}

  @Get('item-stock-histories')
  async reportItemStockHistories(
    @Query() query: ReportItemStockHistoriesRequestDto,
  ): Promise<any> {
    const { request, responseError } = query;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return await this.dashboardService.reportItemStockHistories(request);
  }
}
