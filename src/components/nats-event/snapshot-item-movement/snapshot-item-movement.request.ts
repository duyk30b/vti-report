import { Expose, Type } from 'class-transformer'
import { IsArray, IsDateString, IsDefined, IsIn, IsMongoId, IsNumber, IsString, ValidateNested } from 'class-validator'
import { keysEnum, objectEnum } from 'src/common/helpers'
import { EItemStatus } from 'src/mongo/repository/item/item.schema'

export class SnapshotItemMovementData {
	@Expose()
	@IsDefined()
	@IsNumber()
	timeSync: Date

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
	unitCodePrimary: string // mã đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsString()
	unitCodeSecondary: string // mã đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsString()
	unitNamePrimary: string // tên đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsString()
	unitNameSecondary: string // tên đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsNumber()
	quantityPrimaryStart: number // số lượng đầu kỳ tính theo đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsNumber()
	quantitySecondaryStart: number // số lượng  đầu kỳ tính theo đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsNumber()
	quantityPrimaryImport: number // số lượng nhập trong kỳ tính theo đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsNumber()
	quantitySecondaryImport: number // số lượng  nhập trong kỳ tính theo đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsNumber()
	quantityPrimaryExport: number // số lượng xuất trong kỳ tính theo đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsNumber()
	quantitySecondaryExport: number // số lượng  xuất trong kỳ tính theo đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsNumber()
	quantityPrimaryEnd: number // số lượng cuối kỳ tính theo đơn vị tính chính

	@Expose()
	@IsDefined()
	@IsNumber()
	quantitySecondaryEnd: number // số lượng  cuối kỳ tính theo đơn vị tính phụ

	@Expose()
	@IsDefined()
	@IsString()
	note: string
}

export class SnapshotItemMovementRequest {
	@Expose()
	@IsDefined()
	@Type(() => SnapshotItemMovementData)
	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	data: SnapshotItemMovementData[]
}
