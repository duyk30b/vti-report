import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { WarehouseCheckoutConditionDto } from './warehouse-checkout.dto'
import { WarehouseCheckout, WarehouseCheckoutType } from './warehouse-checkout.schema'

@Injectable()
export class WarehouseCheckoutRepository {
	constructor(@InjectModel('WarehouseCheckoutSchema')
	private readonly warehouseCheckoutModel: Model<WarehouseCheckout>) { }

	getFilterOptions(condition: WarehouseCheckoutConditionDto) {
		const filter: FilterQuery<WarehouseCheckout> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		if (condition.ticketCode != null) filter.ticketCode = condition.ticketCode

		if (condition.timeSync != null) {
			filter.timeSync = condition.timeSync
		}

		return filter
	}

	async findOneBy(condition: WarehouseCheckoutConditionDto): Promise<WarehouseCheckoutType> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.warehouseCheckoutModel.findOne(filter)
		return doc ? doc.toObject() : null
	}

	async findManyBy(condition: any): Promise<WarehouseCheckoutType[]> {
		const docs = await this.warehouseCheckoutModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<WarehouseCheckoutType>>(data: NoExtraProperties<Partial<WarehouseCheckoutType>, T>): Promise<WarehouseCheckoutType> {
		const model = new this.warehouseCheckoutModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<WarehouseCheckoutType>>(data: NoExtraProperties<Partial<WarehouseCheckoutType>, T>[]): Promise<WarehouseCheckoutType[]> {
		const hydratedDocument = await this.warehouseCheckoutModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: WarehouseCheckoutConditionDto): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.warehouseCheckoutModel.deleteMany(filter)
	}
}