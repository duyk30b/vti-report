import { Module } from '@nestjs/common'
import { KafkaEventTicketModule } from './kafka-event-ticket/kafka-event-ticket.module'
import { KafkaEventController } from './kafka-event.controller'
import { KafkaEventService } from './kafka-event.service'
import { KafkaItemMessageModule } from './kafka-item-message/kafka-item-message.module'

@Module({
	imports: [
		KafkaEventTicketModule,
		KafkaItemMessageModule,
	],
	controllers: [KafkaEventController],
	providers: [KafkaEventService],
})
export class KafkaEventModule { }
