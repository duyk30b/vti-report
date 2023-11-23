import { Module } from '@nestjs/common'
import { ApiReportItemModule } from './api-report-item/api-report-item.module'
import { ApiReportWarehouseCheckoutModule } from './api-report-warehouse-checkout/api-report-warehouse-checkout.module'
import { ApiReportWarehouseExportModule } from './api-report-warehouse-export/api-report-warehouse-export.module'
import { ApiReportWarehouseImportModule } from './api-report-warehouse-import/api-report-warehouse-import.module'
import { ApiReportWarehouseTransferModule } from './api-report-warehouse-transfer/api-report-warehouse-transfer.module'

@Module({
	imports: [
		ApiReportItemModule,
		ApiReportWarehouseImportModule,
		ApiReportWarehouseExportModule,
		ApiReportWarehouseTransferModule,
		ApiReportWarehouseCheckoutModule,
	],
	controllers: [],
	providers: [],
})
export class ApiModule {}
