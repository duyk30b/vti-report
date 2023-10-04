import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { WarehouseImport } from './warehouse-import.schema'
import { WarehouseImportConditionDto } from './warehouse-import.dto'

@Injectable()
export class WarehouseImportRepository {
	constructor(@InjectModel('WarehouseImportSchema')
	private readonly warehouseImportModel: Model<WarehouseImport>) { }

	getFilterOptions(condition: WarehouseImportConditionDto) {
		const filter: FilterQuery<WarehouseImport> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		if (condition.timeSync != null) {
			filter.timeSync = condition.timeSync
		}

		return filter
	}

	async findOneBy(condition: WarehouseImportConditionDto): Promise<WarehouseImport> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.warehouseImportModel.findOne(filter)
		return doc.toObject()
	}

	async findManyBy(condition: any): Promise<WarehouseImport[]> {
		const docs = await this.warehouseImportModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<WarehouseImport>>(data: NoExtraProperties<Partial<WarehouseImport>, T>): Promise<WarehouseImport> {
		const model = new this.warehouseImportModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<WarehouseImport>>(data: NoExtraProperties<Partial<WarehouseImport>, T>[]): Promise<WarehouseImport[]> {
		const hydratedDocument = await this.warehouseImportModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: WarehouseImportConditionDto): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.warehouseImportModel.deleteMany(filter)
	}

	async report(filter: { fromTime: Date, toTime: Date, warehouseId?: number }): Promise<any> {
		return await this.warehouseImportModel.aggregate([
			{
				$match: {
					$or: [
						{
							$and: [
								{
									documentDate: {
										$gte: filter.fromTime,
										$lt: filter.toTime,
									},
								},
								...[filter.warehouseId ? { warehouseId: { $eq: filter.warehouseId } } : {}],
							],
						},
						{
							$and: [
								{ documentDate: { $eq: null } },
								{
									importDate: {
										$gte: filter.fromTime,
										$lt: filter.toTime,
									},
								},
								...[filter.warehouseId ? { warehouseId: { $eq: filter.warehouseId } } : {}],
							],
						},
					],
				},
			},
			{
				$group: {
					_id: {
						warehouseId: '$warehouseId',
						warehouseName: '$warehouseName',
						templateCode: '$templateCode',
						templateName: '$templateName',
					},
					amount: { $sum: '$amount' },
					tickets: { $push: '$$ROOT' },
				},
			},
			{
				$project: {
					_id: 0,
					warehouseId: '$_id.warehouseId',
					warehouseName: '$_id.warehouseName',
					templateCode: '$_id.templateCode',
					templateName: '$_id.templateName',
					amount: 1,
					tickets: 1,
				},
			},
			{
				$group: {
					_id: {
						warehouseId: '$warehouseId',
						warehouseName: '$warehouseName',
					},
					amount: { $sum: '$amount' },
					templates: {
						$push: {
							$mergeObjects: [
								'$$ROOT',
								{
									templateCode: '$_id.templateCode',
									templateName: '$_id.templateName',
								},
							],
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					warehouseId: '$_id.warehouseId',
					warehouseName: '$_id.warehouseName',
					amount: 1,
					templates: 1,
				},
			},
			{ $sort: { warehouseId: 1 } },
		])
	}
}