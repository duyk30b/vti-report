import { Injectable } from '@nestjs/common'
import { KafkaItemCreateItemRequest, KafkaItemUpdateItemRequest } from './request'

@Injectable()
export class KafkaItemMessageService {
	constructor() { }

	async itemCreateItem({ data }: KafkaItemCreateItemRequest) {
	}

	async itemUpdateItem({ data }: KafkaItemUpdateItemRequest) {
	}
}
