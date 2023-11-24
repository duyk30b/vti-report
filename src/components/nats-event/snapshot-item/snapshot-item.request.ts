import { Expose, Type } from 'class-transformer'
import { IsArray, IsDateString, IsDefined, IsIn, IsMongoId, IsNumber, IsString, ValidateNested } from 'class-validator'
import { keysEnum, objectEnum } from 'src/common/helpers'
import { EItemStatus } from 'src/mongo/repository/item/item.schema'

export class SnapshotItemData {
	@Expose()
	@IsDefined()
	@IsNumber()
	timestampSync: number

	@Expose()
	@IsDefined()
	@IsNumber()
	warehouseId: number

	@Expose()
	@IsDefined()
	@IsString()
	warehouseName: string

	@Expose()
	@IsDefined()
	@IsNumber()
	itemId: number

	@Expose()
	@IsDefined()
	@IsString()
	code: string

	@Expose()
	@IsDefined()
	@IsString()
	nameVn: string

	@Expose()
	@IsDefined()
	@IsString()
	nameJp: string

	@Expose()
	@IsDefined()
	@IsString()
	nameEn: string

	@Expose()
	@IsDefined()
	@IsString()
	typeCode: string // Mã loại sản phẩm

	@Expose()
	@IsDefined()
	@IsString()
	typeName: string // Tên loại sản phẩm

	@Expose()
	@IsDefined()
	@IsString()
	costCenter: string // Cost center

	@Expose()
	@IsDefined()
	@IsString()
	lot: string // Lô

	@Expose()
	@IsDefined()
	@IsString()
	bomVersion: string // BOM version

	@Expose()
	@IsDefined()
	@IsString()
	quality: string // Chất lượng

	@Expose()
	@IsDefined()
	@IsString()
	packingCode: string // Mã quy cách đóng gói

	@Expose()
	@IsDefined()
	@IsString()
	packingName: string // Tên quy cách đóng gói

	@Expose()
	@IsDefined()
	@IsString()
	bundle: string // Bundle

	@Expose()
	@IsDefined()
	@IsString()
	boxCode: string // Bundle

	@Expose()
	@IsDefined()
	@IsDateString()
	importDate: Date // Ngày nhập kho

	@Expose()
	@IsDefined()
	@IsMongoId()
	locatorId: string // ID vị trí

	@Expose()
	@IsDefined()
	@IsString()
	locatorName: string // Tên vị trí

	@Expose()
	@IsDefined()
	@IsIn(keysEnum(EItemStatus), { message: `status must be enum: ${objectEnum(EItemStatus)}` })
	status: EItemStatus

	@Expose()
	@IsDefined()
	@IsNumber()
	quantityPrimary: number // số lượng tính theo đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsNumber()
	quantitySecondary: number // số lượng tính theo đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsString()
	unitCodePrimary: number // mã đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsString()
	unitCodeSecondary: number // mã đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsString()
	unitNamePrimary: number // tên đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsString()
	unitNameSecondary: number // tên đơn vị tính phụ
}

export class SnapshotItemRequest {
	@Expose()
	@Type(() => SnapshotItemData)
	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	data: SnapshotItemData[]
}
