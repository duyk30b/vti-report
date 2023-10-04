import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Inventory } from './inventory.schema'
import { InventoryConditionDto } from './inventory.dto'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'

@Injectable()
export class InventoryRepository {
	constructor(@InjectModel('InventorySchema') private readonly inventoryModel: Model<Inventory>) { }

	getFilterOptions(condition: InventoryConditionDto) {
		const filter: FilterQuery<Inventory> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		return filter
	}

	async findOneBy(condition: InventoryConditionDto): Promise<Inventory> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.inventoryModel.findOne(filter)
		return doc.toObject()
	}

	async findManyBy(condition: InventoryConditionDto): Promise<Inventory[]> {
		const docs = await this.inventoryModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<Inventory>>(data: NoExtraProperties<Partial<Inventory>, T>): Promise<Inventory> {
		const model = new this.inventoryModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<Inventory>>(data: NoExtraProperties<Partial<Inventory>, T>[]): Promise<Inventory[]> {
		const hydratedDocument = await this.inventoryModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: InventoryConditionDto): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.inventoryModel.deleteMany(filter)
	}
}