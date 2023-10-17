import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

@Schema({ timestamps: false })
export class ItemExportBody {
	@Prop()
	itemCode: string

	@Prop()
	itemName: string

	@Prop()
	unit: string

	@Prop()
	importDate: Date                                    // Ngày nhập kho

	@Prop({ required: false })
	lot: string

	@Prop({ required: false })
	manufacturingDate: Date                             // Ngày sản xuất

	@Prop()
	quantity: number

	@Prop()
	price: number

	@Prop()
	amount: number
}
export const ItemExportSchema = SchemaFactory.createForClass(ItemExportBody)

@Schema({ collection: 'warehouseExports', timestamps: true })
export class WarehouseExport extends BaseSchema {
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
	documentDate: Date                                    // Ngày chứng từ

	@Prop()
	exportDate: Date                                      // Ngày thực xuất

	@Prop({ required: false })
	description: string

	@Prop()
	amount: number

	@Prop({ type: [ItemExportSchema], default: [] })
	items: ItemExportBody[]
}

const WarehouseExportSchema = SchemaFactory.createForClass(WarehouseExport)
WarehouseExportSchema.index({ timeSync: 1 }, { unique: false })

export { WarehouseExportSchema }

export type WarehouseExportType = Omit<WarehouseExport, keyof Document<WarehouseExport>>
