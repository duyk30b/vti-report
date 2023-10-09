import { Module } from '@nestjs/common'
import { ApiReportWarehouseExportModule } from './api-report-warehouse-export/api-report-warehouse-export.module'
import { ApiReportWarehouseImportModule } from './api-report-warehouse-import/api-report-warehouse-import.module'
import { ApiReportWarehouseTransferModule } from './api-report-warehouse-transfer/api-report-warehouse-transfer.module'

@Module({
	imports: [
		ApiReportWarehouseImportModule,
		ApiReportWarehouseExportModule,
		ApiReportWarehouseTransferModule,
	],
	controllers: [],
	providers: [],
})
export class ApiModule { }
