import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

export enum ECheckoutType {
	Periodic = 'Periodic', // Định kỳ
	Surprise = 'Surprise' // Đột xuất
}

export enum ECheckoutForm {
	Quantity = 'Quantity',
	QuantityAndLot = 'QuantityAndLot',
	QuantityAndMfg = 'QuantityAndMfg',
	QuantityAndLotAndMfg = 'QuantityAndLotAndMfg',
}

@Schema({ timestamps: false })
export class ItemCheckoutBody {
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
	recordQuantity: number                              // Theo sổ sách

	@Prop()
	recordPrice: number

	@Prop()
	recordAmount: number

	@Prop()
	checkoutQuantity: number                             // Số lượng theo kiểm kê

	@Prop()
	checkoutPrice: number

	@Prop()
	checkoutAmount: number

	@Prop()
	checkoutQuality: number                              // chất lượng theo kiểm kê

	@Prop()
	excessQuantity: number                               // Chênh lệch: số lượng thừa

	@Prop()
	excessAmount: number

	@Prop()
	shortageQuantity: number                             // Chênh lệch: số lượng thiếu

	@Prop()
	shortageAmount: number
}
export const ItemCheckoutSchema = SchemaFactory.createForClass(ItemCheckoutBody)

@Schema({ timestamps: false })
export class WarehouseBody {
	@Prop()
	warehouseId: number

	@Prop()
	warehouseName: string

	@Prop({ type: [ItemCheckoutSchema], default: [] })
	items: ItemCheckoutBody[]
}
export const WarehouseSchema = SchemaFactory.createForClass(WarehouseBody)

@Schema({ collection: 'warehouseCheckouts', timestamps: true })
export class WarehouseCheckout extends BaseSchema {
	@Prop()
	timeSync: Date

	@Prop()
	createTime: Date

	@Prop()
	startTime: Date

	@Prop()
	endTime: Date

	@Prop()
	ticketCode: string

	@Prop({ type: String, enum: ECheckoutType })
	checkoutType: string

	@Prop({ type: String, enum: ECheckoutForm })
	checkoutForm: string

	@Prop({ type: [WarehouseSchema], default: [] })
	warehouses: WarehouseBody[]

	@Prop()
	recordQuantity: number

	@Prop()
	checkoutQuantity: number
}

const WarehouseCheckoutSchema = SchemaFactory.createForClass(WarehouseCheckout)
WarehouseCheckoutSchema.index({ timeSync: 1 }, { unique: false })

export { WarehouseCheckoutSchema }
