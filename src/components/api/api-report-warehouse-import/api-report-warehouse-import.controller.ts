import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { External } from 'src/core/decorator/request-external'
import { PermissionCode } from 'src/core/guard/authorization.guard'
import { REPORT_WAREHOUSE_IMPORT_PERMISSION } from 'src/core/guard/permission'
import { ApiReportWarehouseImportQuery } from './api-report-warehouse-import.request'
import { ApiReportWarehouseImportService } from './api-report-warehouse-import.service'

@Controller('warehouse-import')
@ApiTags('Warehouse Import')
@ApiBearerAuth('access-token')
export class ApiReportWarehouseImportController {
	constructor(private readonly apiReportWarehouseImportService: ApiReportWarehouseImportService) { }

	@PermissionCode(REPORT_WAREHOUSE_IMPORT_PERMISSION.code)
	@Get('export-excel')
	async export(@Query() query: ApiReportWarehouseImportQuery, @External() { user }: any) {
		return await this.apiReportWarehouseImportService.exportExcel(query, user.id)
	}
}
