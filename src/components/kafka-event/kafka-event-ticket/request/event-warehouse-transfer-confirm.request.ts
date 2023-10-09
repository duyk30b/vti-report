import { Expose, Type } from 'class-transformer'
import { IsArray, IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { KafkaBaseRequest } from 'src/modules/kafka/kafka-base.request'

export class WarehouseTransferData {
	@Expose()
	@IsDefined()
	@IsString()
	_id: string

	@Expose()
	@IsDefined()
	@IsString()
	code: string

	@Expose()
	@IsDefined()
	@IsString()
	templateId: string

	@Expose()
	@IsDefined()
	@IsNumber()
	warehouseId: number

	@Expose()
	@IsDefined()
	@IsArray()
	attributes: any[]

	@Expose()
	@IsDefined()
	@IsArray()
	ticketDetails: any[]
}

export class EventWarehouseTransferConfirmRequest extends KafkaBaseRequest {
	@Type(() => WarehouseTransferData)
	@Expose()
	@IsDefined()
	@IsObject()
	@ValidateNested({ each: true })
	data: WarehouseTransferData
}
