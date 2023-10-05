import { Global, Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { KafkaClientService } from './kafka-client.service'
import { KafkaConfig } from './kafka.config'

@Global()
@Module({
	providers: [
		{
			provide: 'KAFKA_CLIENT',
			useFactory: () => {
				return ClientProxyFactory.create(KafkaConfig)
			},
		},
		KafkaClientService,
	],
	exports: [KafkaClientService],
})
export class KafkaClientModule { }
