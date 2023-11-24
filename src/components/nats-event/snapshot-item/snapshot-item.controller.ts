import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { NatsSubject } from 'src/modules/nats/nats.config'
import { SnapshotItemRequest } from './snapshot-item.request'
import { SnapshotItemService } from './snapshot-item.service'

@Controller()
export class SnapshotItemController {
	constructor(private readonly snapshotItemService: SnapshotItemService) {}

	@MessagePattern(NatsSubject.REPORT.SNAPSHOT_ITEMS, Transport.NATS)
	async createManyItem(@Payload() payload: SnapshotItemRequest) {
		return this.snapshotItemService.createManyItem(payload)
	}
}
