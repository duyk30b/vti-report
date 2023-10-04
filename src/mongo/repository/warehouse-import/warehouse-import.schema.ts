import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Expose } from 'class-transformer'
import { BaseSchema } from 'src/mongo/base.schema'

@Schema({ timestamps: false })
export class ItemBody {
	@Prop()
	@Expose()
	itemCode: string

	@Prop()
	@Expose()
	itemName: string

	@Prop()
	@Expose()
	unit: string

	@Prop()
	@Expose()
	importDate: Date                                    // Ngày nhập kho

	@Prop({ required: false })
	@Expose()
	lot: string

	@Prop({ required: false })
	@Expose()
	manufacturingDate: Date                             // Ngày sản xuất

	@Prop()
	@Expose()
	quantity: number

	@Prop()
	@Expose()
	price: number

	@Prop()
	@Expose()
	amount: number
}
export const ItemSchema = SchemaFactory.createForClass(ItemBody)

@Schema({ collection: 'warehouseImports', timestamps: true })
export class WarehouseImport extends BaseSchema {
	@Prop()
	@Expose()
	timeSync: Date

	@Prop()
	@Expose()
	warehouseId: number

	@Prop()
	@Expose()
	warehouseName: string

	@Prop()
	@Expose()
	templateCode: string

	@Prop()
	@Expose()
	templateName: string

	@Prop()
	@Expose()
	ticketId: string

	@Prop()
	@Expose()
	ticketCode: string

	@Prop()
	@Expose()
	documentDate: Date                                    // Ngày chứng từ

	@Prop()
	@Expose()
	importDate: Date                                      // Ngày nhập kho

	@Prop({ required: false })
	@Expose()
	description: string

	@Prop()
	@Expose()
	amount: number

	@Prop({ type: [ItemSchema], default: [] })
	items: ItemBody[]
}

const WarehouseImportSchema = SchemaFactory.createForClass(WarehouseImport)

export { WarehouseImportSchema }
