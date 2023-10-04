import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { KafkaBaseRequest } from 'src/modules/kafka/kafka-base.request'

export class ItemCreateItemData {
	@Expose({ name: 'key' })
	@IsDefined()
	@IsString()
	key: string

	@Expose({ name: 'name' })
	@IsDefined()
	@IsString()
	name: string

	@Expose({ name: 'money' })
	@IsDefined()
	@IsNumber()
	money: number
}

export class KafkaItemCreateItemRequest extends KafkaBaseRequest {
	@Type(() => ItemCreateItemData)
	@Expose()
	@IsDefined()
	@IsObject()
	@ValidateNested({ each: true })
	data: ItemCreateItemData
}
