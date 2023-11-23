import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

export enum EItemStatus {
	Import = 1, // Nhập chưa cất
	ImportAndPutAway = 2, // Nhập đã cẩt
	Pickup = 3, // Lấy chưa xuất
}

@Schema({ timestamps: false })
export class StockBody {
	@Prop()
	lot: string

	@Prop()
	manufacturingDate: Date // Ngày sản xuất

	@Prop()
	importDate: Date // Ngày nhập kho

	@Prop()
	locatorId: string

	@Prop()
	locatorName: string

	@Prop({ type: Number, enum: EItemStatus })
	status: EItemStatus

	@Prop()
	quantity: number
}
export const StockSchema = SchemaFactory.createForClass(StockBody)

@Schema({ collection: 'items', timestamps: true })
export class Item extends BaseSchema {
	@Prop()
	timeSync: Date

	@Prop()
	warehouseId: number

	@Prop()
	itemId: number

	@Prop()
	itemCode: string

	@Prop()
	itemName: string

	@Prop()
	unit: string

	@Prop({ type: [StockSchema], default: [] })
	stocks: StockBody[]

	@Prop()
	quantity: number
}

const ItemSchema = SchemaFactory.createForClass(Item)
ItemSchema.index({ timeSync: 1 }, { unique: false })

export { ItemSchema }

export type ItemType = Omit<Item, keyof Document<Item>>
