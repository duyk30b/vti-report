import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { External } from 'src/core/decorator/request-external'
import { PermissionCode } from 'src/core/guard/authorization.guard'
import { REPORT_WAREHOUSE_CHECKOUT_PERMISSION } from 'src/core/guard/permission'
import { ApiReportWarehouseCheckoutQuery } from './api-report-warehouse-checkout.request'
import { ApiReportWarehouseCheckoutService } from './api-report-warehouse-checkout.service'

@Controller('warehouse-checkout')
@ApiTags('Warehouse Checkout')
@ApiBearerAuth('access-token')
export class ApiReportWarehouseCheckoutController {
	constructor(private readonly apiReportWarehouseCheckoutService: ApiReportWarehouseCheckoutService) {}

	@PermissionCode(REPORT_WAREHOUSE_CHECKOUT_PERMISSION.code)
	@Get('export-excel')
	async export(@Query() query: ApiReportWarehouseCheckoutQuery, @External() { user }: any) {
		return await this.apiReportWarehouseCheckoutService.exportExcel(query, user.id)
	}

	@Get('create-demo')
	async create() {
		return await this.apiReportWarehouseCheckoutService.createOne()
	}
}
