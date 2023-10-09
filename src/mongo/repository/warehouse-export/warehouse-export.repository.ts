import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { WarehouseExportConditionDto } from './warehouse-export.dto'
import { WarehouseExport } from './warehouse-export.schema'

@Injectable()
export class WarehouseExportRepository {
	constructor(@InjectModel('WarehouseExportSchema')
	private readonly warehouseExportModel: Model<WarehouseExport>) { }

	getFilterOptions(condition: WarehouseExportConditionDto) {
		const filter: FilterQuery<WarehouseExport> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		if (condition.timeSync != null) {
			filter.timeSync = condition.timeSync
		}

		return filter
	}

	async findOneBy(condition: WarehouseExportConditionDto): Promise<WarehouseExport> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.warehouseExportModel.findOne(filter)
		return doc.toObject()
	}

	async findManyBy(condition: any): Promise<WarehouseExport[]> {
		const docs = await this.warehouseExportModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<WarehouseExport>>(data: NoExtraProperties<Partial<WarehouseExport>, T>): Promise<WarehouseExport> {
		const model = new this.warehouseExportModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<WarehouseExport>>(data: NoExtraProperties<Partial<WarehouseExport>, T>[]): Promise<WarehouseExport[]> {
		const hydratedDocument = await this.warehouseExportModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: WarehouseExportConditionDto): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.warehouseExportModel.deleteMany(filter)
	}

	async report(filter: { fromTime: Date, toTime: Date, warehouseId?: number }): Promise<any> {
		return await this.warehouseExportModel.aggregate([
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
									exportDate: {
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