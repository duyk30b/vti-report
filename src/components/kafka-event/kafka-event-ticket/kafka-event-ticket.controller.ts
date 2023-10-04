import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { KafkaTopic } from 'src/modules/kafka/kafka.config'
import { KafkaTicketEventService } from './kafka-event-ticket.service'
import { KafkaTicketWarehouseImportConfirmRequest } from './request'

@Controller()
export class KafkaTicketEventController {
	constructor(private readonly kafkaTicketEventService: KafkaTicketEventService) {
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_IMPORT_CONFIRM, Transport.KAFKA)
	async ticketWarehouseImportConfirm(@Payload() payload: KafkaTicketWarehouseImportConfirmRequest) {
		return this.kafkaTicketEventService.ticketWarehouseImportConfirm(payload)
	}
}
