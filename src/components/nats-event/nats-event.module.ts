import { Module } from '@nestjs/common'
import { NatsEventController } from './nats-event.controller'
import { NatsEventService } from './nats-event.service'
import { SnapshotItemModule } from './snapshot-item/snapshot-item.module'

@Module({
	imports: [SnapshotItemModule],
	controllers: [NatsEventController],
	providers: [NatsEventService],
})
export class NatsEventModule {}
