import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { External } from 'src/core/decorator/request-external'
import { PermissionCode } from 'src/core/guard/authorization.guard'
import { REPORT_WAREHOUSE_EXPORT_PERMISSION } from 'src/core/guard/permission'
import { ApiReportWarehouseExportQuery } from './api-report-warehouse-export.request'
import { ApiReportWarehouseExportService } from './api-report-warehouse-export.service'

@Controller('warehouse-export')
@ApiTags('Warehouse Export')
@ApiBearerAuth('access-token')
export class ApiReportWarehouseExportController {
	constructor(private readonly apiReportWarehouseExportService: ApiReportWarehouseExportService) { }

	@PermissionCode(REPORT_WAREHOUSE_EXPORT_PERMISSION.code)
	@Get('export-excel')
	async export(@Query() query: ApiReportWarehouseExportQuery, @External() { user }: any) {
		return await this.apiReportWarehouseExportService.exportExcel(query, user.id)
	}
}
