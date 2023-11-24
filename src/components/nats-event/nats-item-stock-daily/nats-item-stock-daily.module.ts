import { Module } from '@nestjs/common'
import { NatsItemStockDailyController } from './nats-item-stock-daily.controller'
import { NatsItemStockDailyService } from './nats-item-stock-daily.service'

@Module({
  imports: [],
  controllers: [NatsItemStockDailyController],
  providers: [NatsItemStockDailyService],
})
export class NatsItemStockDailyModule {}
