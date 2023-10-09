import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Expose } from 'class-transformer'
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
export const ItemSchema = SchemaFactory.createForClass(ItemImportBody)

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
	documentDate: Date                                    // Ngày chứng từ

	@Prop()
	importDate: Date                                      // Ngày thực nhập

	@Prop({ required: false })
	description: string

	@Prop()
	amount: number

	@Prop({ type: [ItemSchema], default: [] })
	items: ItemImportBody[]
}

const WarehouseImportSchema = SchemaFactory.createForClass(WarehouseImport)

export { WarehouseImportSchema }
