import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

@Schema({ timestamps: false })
export class ItemImportBody {
	@Prop()
	itemCode: string

	@Prop()
	itemName: string

	@Prop()
	unit: string

	@Prop()
	importDate: Date // Ngày nhập kho

	@Prop({ required: false })
	lot: string

	@Prop({ required: false })
	manufacturingDate: Date // Ngày sản xuất

	@Prop()
	quantity: number

	@Prop()
	price: number

	@Prop()
	amount: number
}
export const ItemImportSchema = SchemaFactory.createForClass(ItemImportBody)

@Schema({ collection: 'warehouseImports', timestamps: true })
export class WarehouseImport extends BaseSchema {
	@Prop()
	timeSync: Date

	@Prop()
	warehouseId: number

	@Prop()
	warehouseName: string

	@Prop()
	templateCode: string

	@Prop()
	templateName: string

	@Prop()
	ticketId: string

	@Prop()
	ticketCode: string

	@Prop()
	documentDate: Date // Ngày chứng từ

	@Prop()
	importDate: Date // Ngày thực nhập

	@Prop({ required: false })
	description: string

	@Prop()
	amount: number

	@Prop({ type: [ItemImportSchema], default: [] })
	items: ItemImportBody[]
}

const WarehouseImportSchema = SchemaFactory.createForClass(WarehouseImport)
WarehouseImportSchema.index({ timeSync: 1 }, { unique: false })

export { WarehouseImportSchema }

export type WarehouseImportType = Omit<WarehouseImport, keyof Document<WarehouseImport>>
