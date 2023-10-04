import { Module } from '@nestjs/common'
import { KafkaItemMessageController } from './kafka-item-message.controller'
import { KafkaItemMessageService } from './kafka-item-message.service'

@Module({
	imports: [],
	controllers: [KafkaItemMessageController],
	providers: [KafkaItemMessageService],
})
export class KafkaItemMessageModule { }
