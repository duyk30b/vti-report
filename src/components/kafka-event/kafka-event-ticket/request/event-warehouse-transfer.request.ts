import { Expose, Type } from 'class-transformer'
import { IsArray, IsDate, IsDefined, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
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
	warehouseImportId: number

	@Expose()
	@IsDefined()
	@IsNumber()
	warehouseExportId: number

	@Expose()
	@Type(() => Date)
	@IsDate()
	transferDate: Date // ngày thực chuyển

	@Expose()
	@IsNumber()
	status: number

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

export class EventWarehouseTransferRequest extends KafkaBaseRequest {
	@Type(() => WarehouseTransferData)
	@Expose()
	@IsDefined()
	@IsObject()
	@ValidateNested({ each: true })
	data: WarehouseTransferData
}
