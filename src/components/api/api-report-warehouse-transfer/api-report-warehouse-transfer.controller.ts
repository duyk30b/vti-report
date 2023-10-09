import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { External } from 'src/core/decorator/request-external'
import { PermissionCode } from 'src/core/guard/authorization.guard'
import { REPORT_WAREHOUSE_EXPORT_PERMISSION } from 'src/core/guard/permission'
import { ApiReportWarehouseTransferQuery } from './api-report-warehouse-transfer.request'
import { ApiReportWarehouseTransferService } from './api-report-warehouse-transfer.service'

@Controller('warehouse-transfer')
@ApiTags('Warehouse Transfer')
@ApiBearerAuth('access-token')
export class ApiReportWarehouseTransferController {
	constructor(private readonly apiReportWarehouseTransferService: ApiReportWarehouseTransferService) { }

	@PermissionCode(REPORT_WAREHOUSE_EXPORT_PERMISSION.code)
	@Get('export-excel')
	async export(@Query() query: ApiReportWarehouseTransferQuery, @External() { user }: any) {
		return await this.apiReportWarehouseTransferService.exportExcel(query, user.id)
	}
}
