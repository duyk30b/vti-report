import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

@Schema({ collection: 'item_movements', timestamps: true })
export class ItemMovement extends BaseSchema {
	@Prop()
	timeSync: Date

	@Prop()
	warehouseId: number

	@Prop()
	warehouseName: string

	@Prop()
	itemId: number

	@Prop()
	code: string

	@Prop()
	nameVn: string

	@Prop()
	nameJp: string

	@Prop()
	nameEn: string

	@Prop()
	typeCode: string // Mã loại sản phẩm

	@Prop()
	typeName: string // Tên loại sản phẩm

	@Prop()
	costCenter: string // Cost center

	@Prop()
	lot: string // Lô

	@Prop()
	unitCodePrimary: number // mã đơn vị tính chính

	@Prop()
	unitCodeSecondary: number // mã đơn vị tính phụ

	@Prop()
	unitNamePrimary: number // tên đơn vị tính chính

	@Prop()
	unitNameSecondary: number // tên đơn vị tính phụ

	@Prop()
	quantityPrimaryStart: number // số lượng đầu kỳ tính theo đơn vị tính chính

	@Prop()
	quantitySecondaryStart: number // số lượng  đầu kỳ tính theo đơn vị tính phụ

	@Prop()
	quantityPrimaryImport: number // số lượng nhập trong kỳ tính theo đơn vị tính chính

	@Prop()
	quantitySecondaryImport: number // số lượng  nhập trong kỳ tính theo đơn vị tính phụ

	@Prop()
	quantityPrimaryExport: number // số lượng xuất trong kỳ tính theo đơn vị tính chính

	@Prop()
	quantitySecondaryExport: number // số lượng  xuất trong kỳ tính theo đơn vị tính phụ

	@Prop()
	quantityPrimaryEnd: number // số lượng cuối kỳ tính theo đơn vị tính chính

	@Prop()
	quantitySecondaryEnd: number // số lượng  cuối kỳ tính theo đơn vị tính phụ

	@Prop()
	note: string
}

const ItemMovementSchema = SchemaFactory.createForClass(ItemMovement)
ItemMovementSchema.index({ timestampSync: 1 }, { unique: false })

export { ItemMovementSchema }

export type ItemMovementType = Omit<ItemMovement, keyof Document<ItemMovement>>
