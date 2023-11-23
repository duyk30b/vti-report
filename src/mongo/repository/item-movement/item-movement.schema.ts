import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

@Schema({ collection: 'itemMovements', timestamps: true })
export class ItemMovement extends BaseSchema {
	@Prop()
	timeSync: Date

	@Prop()
	warehouseId: number

	@Prop()
	warehouseName: string

	@Prop()
	itemCode: string

	@Prop()
	itemName: string

	@Prop()
	unit: string

	@Prop({ required: false })
	lot: string

	@Prop()
	importDate: Date // Ngày nhập kho

	@Prop({ required: false })
	manufacturingDate: Date // Ngày sản xuất

	@Prop()
	quantity: number

	@Prop()
	price: number

	@Prop()
	amount: number
}

const ItemMovementSchema = SchemaFactory.createForClass(ItemMovement)

export { ItemMovementSchema }
