import { Body, Controller, Post } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { NatsSubject } from 'src/modules/nats/nats.config'
import { NatsItemStockDailyRequest } from './nats-item-stock-daily.request'
import { NatsItemStockDailyService } from './nats-item-stock-daily.service'

@Controller('nats-item-stock-daily')
@ApiTags('Nats ItemStockDaily')
@ApiBearerAuth('access-token')
export class NatsItemStockDailyController {
  constructor(private readonly natsItemStockDailyService: NatsItemStockDailyService) {}

  @MessagePattern(NatsSubject.REPORT.SNAPSHOT_ITEMS, Transport.NATS)
  async createManyItem(@Payload() payload: NatsItemStockDailyRequest) {
    return this.natsItemStockDailyService.createManyItem(payload)
  }

  @Post('test-create')
  async testCreate(@Body() body: NatsItemStockDailyRequest) {
    return this.natsItemStockDailyService.createManyItem(body)
  }
}
