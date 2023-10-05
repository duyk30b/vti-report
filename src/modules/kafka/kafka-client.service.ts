import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { Producer } from 'kafkajs'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class KafkaClientService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(KafkaClientService.name)
	private kafkaProducer: Producer

	constructor(@Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka) { }

	async onModuleInit() {
		try {
			this.kafkaProducer = await this.kafkaClient.connect()
		} catch (error) {
			this.logger.error(error)
		}
	}

	async onModuleDestroy() {
		await this.kafkaProducer.disconnect()
	}

	async emitMessage(topicName: string, content: { [P in 'data' | 'meta']?: any }, version = 1) {
		const message = {
			...content,
			createTime: new Date().getTime(),
			version,
		}
		const response = this.kafkaClient.emit(topicName, message)
		return await lastValueFrom(response)
	}

	async sendMessage(topicName: string, content: { [P in 'data' | 'meta']?: any }, version = 1) {
		const message = {
			...content,
			createTime: new Date().getTime(),
			version,
		}

		return await this.kafkaProducer.send({
			topic: topicName,
			messages: [{ key: 'data', value: JSON.stringify(message) }],
			acks: -1,
		})
	}
}
