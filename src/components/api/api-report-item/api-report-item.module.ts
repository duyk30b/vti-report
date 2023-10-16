import { Module } from '@nestjs/common'
import { ApiReportItemController } from './api-report-item.controller'
import { ApiReportItemService } from './api-report-item.service'

@Module({
	imports: [],
	controllers: [ApiReportItemController],
	providers: [ApiReportItemService],
})
export class ApiReportItemModule { }
