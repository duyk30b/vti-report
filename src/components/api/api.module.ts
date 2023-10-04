import { Module } from '@nestjs/common'
import { ApiReportWarehouseImportModule } from './api-report-warehouse-import/api-report-warehouse-import.module'

@Module({
	imports: [ApiReportWarehouseImportModule],
	controllers: [],
	providers: [],
})
export class ApiModule { }
