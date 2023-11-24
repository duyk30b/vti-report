import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { External } from 'src/core/decorator/request-external'
import { PermissionCode } from 'src/core/guard/authorization.guard'
import { REPORT_ITEM_PERMISSION } from 'src/core/guard/permission'
import { ApiItemStockDailyQuery } from './api-item-stock-daily.request'
import { ApiItemStockDailyService } from './api-item-stock-daily.service'

@Controller('item')
@ApiTags('Items')
@ApiBearerAuth('access-token')
export class ApiItemStockDailyController {
  constructor(private readonly apiItemStockDailyService: ApiItemStockDailyService) {}

  @PermissionCode(REPORT_ITEM_PERMISSION.code)
  @Get('export-excel')
  async export(@Query() query: ApiItemStockDailyQuery, @External() { user }: any) {
    return await this.apiItemStockDailyService.exportExcel(query, user.id)
  }
}
