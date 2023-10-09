import { Module } from '@nestjs/common'
import { ApiReportWarehouseExportController } from './api-report-warehouse-export.controller'
import { ApiReportWarehouseExportService } from './api-report-warehouse-export.service'

@Module({
	imports: [],
	controllers: [ApiReportWarehouseExportController],
	providers: [ApiReportWarehouseExportService],
})
export class ApiReportWarehouseExportModule { }
