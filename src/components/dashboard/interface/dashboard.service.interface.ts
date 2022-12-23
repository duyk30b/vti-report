import { ReportItemStockHistoriesRequestDto } from '../dto/request/report-item-stock-histories.request.dto';

export interface DashboardServiceInterface {
  reportItemStockHistories(
    request: ReportItemStockHistoriesRequestDto,
  ): Promise<any>;
}
