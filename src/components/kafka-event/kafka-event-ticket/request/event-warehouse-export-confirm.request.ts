import { Expose, Type } from 'class-transformer'
import { IsArray, IsDate, IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { KafkaBaseRequest } from 'src/modules/kafka/kafka-base.request'

export class WarehouseExportData {
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
	exportDate: Date // ngày thực xuất

	@Expose()
	@IsDefined()
	@IsArray()
	attributes: any[]

	attributeMap: Record<string, any>

	@Expose()
	@IsDefined()
	@IsArray()
	ticketDetails: any[]
}

export class EventWarehouseExportConfirmRequest extends KafkaBaseRequest {
	@Type(() => WarehouseExportData)
	@Expose()
	@IsDefined()
	@IsObject()
	@ValidateNested({ each: true })
	data: WarehouseExportData
}
