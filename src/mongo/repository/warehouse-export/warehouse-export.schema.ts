import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
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
export const ItemSchema = SchemaFactory.createForClass(ItemExportBody)

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
	exportDate: Date                                      // Ngày xuất kho

	@Prop({ required: false })
	description: string

	@Prop()
	amount: number

	@Prop({ type: [ItemSchema], default: [] })
	items: ItemExportBody[]
}

const WarehouseExportSchema = SchemaFactory.createForClass(WarehouseExport)

export { WarehouseExportSchema }
