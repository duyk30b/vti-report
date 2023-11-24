import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsArray, IsDateString, IsDefined, IsIn, IsMongoId, IsNumber, IsString, ValidateNested } from 'class-validator'
import { keysEnum, objectEnum, valuesEnum } from 'src/common/helpers'
import { EItemStatus } from 'src/mongo/repository/item/item.schema'

export class SnapshotItemData {
	@ApiProperty({ example: 1700845208999 })
	@Expose()
	@IsDefined()
	@IsNumber()
	timestampSync: number

	@ApiProperty({ example: 15 })
	@Expose()
	@IsDefined()
	@IsNumber()
	warehouseId: number

	@ApiProperty({ example: 'Kho thực phẩm' })
	@Expose()
	@IsDefined()
	@IsString()
	warehouseName: string

	@ApiProperty({ example: 25 })
	@Expose()
	@IsDefined()
	@IsNumber()
	itemId: number

	@ApiProperty({ example: 'X02_PS' })
	@Expose()
	@IsDefined()
	@IsString()
	code: string

	@ApiProperty({ example: 'Thịt đông lạnh' })
	@Expose()
	@IsDefined()
	@IsString()
	nameVn: string

	@ApiProperty({ example: '' })
	@Expose()
	@IsDefined()
	@IsString()
	nameJp: string

	@ApiProperty({ example: 'mean' })
	@Expose()
	@IsDefined()
	@IsString()
	nameEn: string

	@ApiProperty({ example: 'UNIT_Z' })
	@Expose()
	@IsDefined()
	@IsString()
	typeCode: string // Mã loại sản phẩm

	@ApiProperty({ example: 'kg' })
	@Expose()
	@IsDefined()
	@IsString()
	typeName: string // Tên loại sản phẩm

	@ApiProperty({ example: 'Z02' })
	@Expose()
	@IsDefined()
	@IsString()
	costCenter: string // Cost center

	@ApiProperty({ example: '2css02' })
	@Expose()
	@IsDefined()
	@IsString()
	lot: string // Lô

	@ApiProperty({ example: 'Kwe' })
	@Expose()
	@IsDefined()
	@IsString()
	bomVersion: string // BOM version

	@ApiProperty({ example: '60%' })
	@Expose()
	@IsDefined()
	@IsString()
	quality: string // Chất lượng

	@ApiProperty({ example: 'QL_90' })
	@Expose()
	@IsDefined()
	@IsString()
	packingCode: string // Mã quy cách đóng gói

	@ApiProperty({ example: 'XXS' })
	@Expose()
	@IsDefined()
	@IsString()
	packingName: string // Tên quy cách đóng gói

	@ApiProperty({ example: 'Bdq02' })
	@Expose()
	@IsDefined()
	@IsString()
	bundle: string // Bundle

	@ApiProperty({ example: 'P02' })
	@Expose()
	@IsDefined()
	@IsString()
	boxCode: string // Mã thùng

	@ApiProperty({ example: '2023-11-24T06:36:50.327Z' })
	@Expose()
	@IsDefined()
	@IsDateString()
	importDate: Date // Ngày nhập kho

	@ApiProperty({ example: '6490029ef9c5580ec7309590' })
	@Expose()
	@IsDefined()
	@IsMongoId()
	locatorId: string // ID vị trí

	@ApiProperty({ example: 'Tầng 2 -> Kệ 2' })
	@Expose()
	@IsDefined()
	@IsString()
	locatorName: string // Tên vị trí

	@ApiProperty({ example: EItemStatus.ImportAndPutAway })
	@Expose()
	@IsDefined()
	@IsIn(valuesEnum(EItemStatus), { message: `status must be enum: ${JSON.stringify(objectEnum(EItemStatus))}` })
	status: EItemStatus

	@ApiProperty({ example: 14 })
	@Expose()
	@IsDefined()
	@IsNumber()
	quantityPrimary: number // số lượng tính theo đơn vị tính chính

	@ApiProperty({ example: 300 })
	@Expose()
	@IsDefined()
	@IsNumber()
	quantitySecondary: number // số lượng tính theo đơn vị tính phụ

	@ApiProperty({ example: 'THU' })
	@Expose()
	@IsDefined()
	@IsString()
	unitCodePrimary: string // mã đơn vị tính chính

	@ApiProperty({ example: 'CHAI' })
	@Expose()
	@IsDefined()
	@IsString()
	unitCodeSecondary: string // mã đơn vị tính phụ

	@ApiProperty({ example: 'Thùng' })
	@Expose()
	@IsDefined()
	@IsString()
	unitNamePrimary: string // tên đơn vị tính chính

	@ApiProperty({ example: 'Chai' })
	@Expose()
	@IsDefined()
	@IsString()
	unitNameSecondary: string // tên đơn vị tính phụ
}

export class SnapshotItemRequest {
	@ApiProperty({ type: SnapshotItemData, isArray: true })
	@Expose()
	@Type(() => SnapshotItemData)
	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	data: SnapshotItemData[]
}
