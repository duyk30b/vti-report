import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { ItemMovementConditionDto } from './item-movement.dto'
import { ItemMovement, ItemMovementType } from './item-movement.schema'

@Injectable()
export class ItemMovementRepository {
	constructor(@InjectModel('ItemMovementSchema') private readonly itemMovementModel: Model<ItemMovement>) {}

	getFilterOptions(condition: ItemMovementConditionDto) {
		const filter: FilterQuery<ItemMovement> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		return filter
	}

	async findOneBy(condition: ItemMovementConditionDto): Promise<ItemMovementType> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.itemMovementModel.findOne(filter)
		return doc.toObject()
	}

	async findManyBy(condition: ItemMovementConditionDto): Promise<ItemMovementType[]> {
		const docs = await this.itemMovementModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<ItemMovementType>>(
		data: NoExtraProperties<Partial<ItemMovementType>, T>
	): Promise<ItemMovementType> {
		const model = new this.itemMovementModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<ItemMovementType>>(
		data: NoExtraProperties<Partial<ItemMovementType>, T>[]
	): Promise<ItemMovementType[]> {
		const hydratedDocument = await this.itemMovementModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async insertManyFullField<T extends ItemMovementType>(
		data: NoExtraProperties<ItemMovementType, T>[]
	): Promise<ItemMovementType[]> {
		const hydratedDocument = await this.itemMovementModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: ItemMovementConditionDto): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.itemMovementModel.deleteMany(filter)
	}
}
