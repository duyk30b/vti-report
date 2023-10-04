import { Module } from '@nestjs/common'
import { KafkaTicketEventController } from './kafka-event-ticket.controller'
import { KafkaTicketEventService } from './kafka-event-ticket.service'

@Module({
	imports: [],
	controllers: [KafkaTicketEventController],
	providers: [KafkaTicketEventService],
})
export class KafkaTicketMessageModule { }
