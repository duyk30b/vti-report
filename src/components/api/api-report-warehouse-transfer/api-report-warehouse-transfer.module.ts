import { Module } from '@nestjs/common'
import { ApiReportWarehouseTransferController } from './api-report-warehouse-transfer.controller'
import { ApiReportWarehouseTransferService } from './api-report-warehouse-transfer.service'

@Module({
	imports: [],
	controllers: [ApiReportWarehouseTransferController],
	providers: [ApiReportWarehouseTransferService],
})
export class ApiReportWarehouseTransferModule { }
