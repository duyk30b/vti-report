import { Expose, Type } from 'class-transformer'
import { IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { KafkaBaseRequest } from 'src/modules/kafka/kafka-base.request'

export class ItemUpdateItemData {
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

export class KafkaItemUpdateItemRequest extends KafkaBaseRequest {
	@Type(() => ItemUpdateItemData)
	@Expose()
	@IsDefined()
	@IsObject()
	@ValidateNested({ each: true })
	data: ItemUpdateItemData
}
