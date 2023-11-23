import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { External } from 'src/core/decorator/request-external'
import { PermissionCode } from 'src/core/guard/authorization.guard'
import { REPORT_ITEM_PERMISSION } from 'src/core/guard/permission'
import { ApiReportItemQuery } from './api-report-item.request'
import { ApiReportItemService } from './api-report-item.service'

@Controller('item')
@ApiTags('Items')
@ApiBearerAuth('access-token')
export class ApiReportItemController {
	constructor(private readonly apiReportItemService: ApiReportItemService) {}

	@PermissionCode(REPORT_ITEM_PERMISSION.code)
	@Get('export-excel')
	async export(@Query() query: ApiReportItemQuery, @External() { user }: any) {
		return await this.apiReportItemService.exportExcel(query, user.id)
	}
}
