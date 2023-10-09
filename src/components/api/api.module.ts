import { Module } from '@nestjs/common'
import { ApiReportWarehouseExportModule } from './api-report-warehouse-export/api-report-warehouse-export.module'
import { ApiReportWarehouseImportModule } from './api-report-warehouse-import/api-report-warehouse-import.module'

@Module({
	imports: [
		ApiReportWarehouseImportModule,
		ApiReportWarehouseExportModule,
	],
	controllers: [],
	providers: [],
})
export class ApiModule { }
