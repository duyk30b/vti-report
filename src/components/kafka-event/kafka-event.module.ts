import { Module } from '@nestjs/common'
import { KafkaTicketMessageModule } from './kafka-event-ticket/kafka-event-ticket.module'
import { KafkaEventController } from './kafka-event.controller'
import { KafkaEventService } from './kafka-event.service'
import { KafkaItemMessageModule } from './kafka-item-message/kafka-item-message.module'

@Module({
	imports: [
		KafkaTicketMessageModule,
		KafkaItemMessageModule,
	],
	controllers: [KafkaEventController],
	providers: [KafkaEventService],
})
export class KafkaEventModule { }
