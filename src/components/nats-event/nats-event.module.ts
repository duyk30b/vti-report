import { Module } from '@nestjs/common'
import { NatsEventController } from './nats-event.controller'
import { NatsEventService } from './nats-event.service'
import { NatsItemStockDailyModule } from './nats-item-stock-daily/nats-item-stock-daily.module'

@Module({
  imports: [NatsItemStockDailyModule],
  controllers: [NatsEventController],
  providers: [NatsEventService],
})
export class NatsEventModule {}
