import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { KafkaTopic } from 'src/modules/kafka/kafka.config'
import { KafkaItemMessageService } from './kafka-item-message.service'
import { KafkaItemCreateItemRequest, KafkaItemUpdateItemRequest } from './request'

@Controller()
export class KafkaItemMessageController {
	constructor(private readonly kafkaItemMessageService: KafkaItemMessageService) {
	}

	@MessagePattern(KafkaTopic.ITEM.CREATE_ITEM, Transport.KAFKA)
	async itemCreateItem(@Payload() payload: KafkaItemCreateItemRequest) {
		return this.kafkaItemMessageService.itemCreateItem(payload)
	}

	@MessagePattern(KafkaTopic.ITEM.UPDATE_ITEM, Transport.KAFKA)
	async itemUpdateItem(@Payload() payload: KafkaItemUpdateItemRequest) {
		return this.kafkaItemMessageService.itemUpdateItem(payload)
	}
}
