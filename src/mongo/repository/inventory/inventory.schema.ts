import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

@Schema({ collection: 'inventory', timestamps: true })
export class Inventory extends BaseSchema {
	@Prop({ required: false })
	companyCode: string

	@Prop({ required: false })
	companyName: string

	@Prop({ required: false })
	warehouseCode: string

	@Prop({ required: false })
	warehouseName: string

	@Prop({ required: false })
	locatorCode: string

	@Prop({ required: false })
	locatorName: string

	@Prop({ required: false })
	lotNumber: string

	@Prop({ required: false })
	itemCode: string

	@Prop({ required: false })
	itemName: string

	@Prop({ required: false })
	unit: string

	@Prop({ required: false })
	storageDate: Date

	@Prop({ required: false })
	stockQuantity: number

	@Prop({ required: false })
	reportDate: Date

	@Prop({ required: false })
	productionDate: Date

	@Prop({ required: false })
	status: number

	@Prop({ required: false })
	price: number

	@Prop({ required: false })
	totalAmount: number
}

const InventorySchema = SchemaFactory.createForClass(Inventory)

export { InventorySchema }
