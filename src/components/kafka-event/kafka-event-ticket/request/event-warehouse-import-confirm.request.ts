import { Expose, Type } from 'class-transformer'
import { IsArray, IsDate, IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { KafkaBaseRequest } from 'src/modules/kafka/kafka-base.request'

export class WarehouseImportData {
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
	@Type(() => Date)
	@IsDate()
	importDate: Date // ngày thực nhập

	@Expose()
	@IsDefined()
	@IsArray()
	attributes: any[]

	@Expose()
	@IsDefined()
	@IsArray()
	ticketDetails: any[]
}

export class EventWarehouseImportConfirmRequest extends KafkaBaseRequest {
	@Type(() => WarehouseImportData)
	@Expose()
	@IsDefined()
	@IsObject()
	@ValidateNested({ each: true })
	data: WarehouseImportData
}
