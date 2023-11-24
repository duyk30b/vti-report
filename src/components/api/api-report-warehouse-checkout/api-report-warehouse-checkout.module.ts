import { Module } from '@nestjs/common'
import { ApiReportWarehouseCheckoutController } from './api-report-warehouse-checkout.controller'
import { ApiReportWarehouseCheckoutService } from './api-report-warehouse-checkout.service'

@Module({
  imports: [],
  controllers: [ApiReportWarehouseCheckoutController],
  providers: [ApiReportWarehouseCheckoutService],
})
export class ApiReportWarehouseCheckoutModule {}
