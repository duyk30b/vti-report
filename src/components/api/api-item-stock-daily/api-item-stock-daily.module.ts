import { Module } from '@nestjs/common'
import { ApiItemStockDailyController } from './api-item-stock-daily.controller'
import { ApiItemStockDailyService } from './api-item-stock-daily.service'

@Module({
  imports: [],
  controllers: [ApiItemStockDailyController],
  providers: [ApiItemStockDailyService],
})
export class ApiItemStockDailyModule {}
