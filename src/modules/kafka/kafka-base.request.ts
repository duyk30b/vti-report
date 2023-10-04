import { Expose } from 'class-transformer'
import { IsNumber } from 'class-validator'

export class KafkaBaseRequest {
	@Expose()
	@IsNumber()
	createTime: number

	@Expose()
	@IsNumber()
	version: number
}
