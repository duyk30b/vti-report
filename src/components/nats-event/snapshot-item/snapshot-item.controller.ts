import { Body, Controller, Post } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { NatsSubject } from 'src/modules/nats/nats.config'
import { SnapshotItemRequest } from './snapshot-item.request'
import { SnapshotItemService } from './snapshot-item.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('snapshot-item')
@ApiTags('Snapshot Item')
@ApiBearerAuth('access-token')
export class SnapshotItemController {
  constructor(private readonly snapshotItemService: SnapshotItemService) {}

  @MessagePattern(NatsSubject.REPORT.SNAPSHOT_ITEMS, Transport.NATS)
  async createManyItem(@Payload() payload: SnapshotItemRequest) {
    return this.snapshotItemService.createManyItem(payload)
  }

  @Post('demo-item')
  async testBody(@Body() body: SnapshotItemRequest) {
    return this.snapshotItemService.createManyItem(body)
  }
}
