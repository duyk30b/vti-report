import { Module } from '@nestjs/common'
import { ApiItemStockDailyModule } from './api-item-stock-daily/api-item-stock-daily.module'
import { ApiReportWarehouseCheckoutModule } from './api-report-warehouse-checkout/api-report-warehouse-checkout.module'
import { ApiReportWarehouseExportModule } from './api-report-warehouse-export/api-report-warehouse-export.module'
import { ApiReportWarehouseImportModule } from './api-report-warehouse-import/api-report-warehouse-import.module'
import { ApiReportWarehouseTransferModule } from './api-report-warehouse-transfer/api-report-warehouse-transfer.module'

@Module({
  imports: [
    ApiItemStockDailyModule,
    ApiReportWarehouseImportModule,
    ApiReportWarehouseExportModule,
    ApiReportWarehouseTransferModule,
    ApiReportWarehouseCheckoutModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
