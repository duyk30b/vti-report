import { Module } from '@nestjs/common'
import { ApiReportWarehouseImportController } from './api-report-warehouse-import.controller'
import { ApiReportWarehouseImportService } from './api-report-warehouse-import.service'

@Module({
	imports: [],
	controllers: [ApiReportWarehouseImportController],
	providers: [ApiReportWarehouseImportService],
})
export class ApiReportWarehouseImportModule { }
