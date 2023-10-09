import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

@Schema({ timestamps: false })
export class ItemTransferBody {
	@Prop()
	itemCode: string

	@Prop()
	itemName: string

	@Prop()
	unit: string

	@Prop({ required: false })
	lot: string

	@Prop({ required: false })
	manufacturingDate: Date                             // Ngày sản xuất

	@Prop()
	importDate: Date                                    // Ngày nhập kho

	@Prop()
	quantity: number

	@Prop()
	price: number

	@Prop()
	amount: number
}
export const ItemSchema = SchemaFactory.createForClass(ItemTransferBody)

@Schema({ collection: 'warehouseTransfers', timestamps: true })
export class WarehouseTransfer extends BaseSchema {
	@Prop()
	timeSync: Date

	@Prop()
	warehouseExportId: number

	@Prop()
	warehouseExportName: string

	@Prop()
	warehouseImportId: number

	@Prop()
	warehouseImportName: string

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
	transferDate: Date                                    // Ngày thực chuyển

	@Prop()
	transferStatus: number

	@Prop({ required: false })
	description: string

	@Prop()
	amount: number

	@Prop({ type: [ItemSchema], default: [] })
	items: ItemTransferBody[]
}

const WarehouseTransferSchema = SchemaFactory.createForClass(WarehouseTransfer)

export { WarehouseTransferSchema }
