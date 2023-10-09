import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { WarehouseTransferConditionDto } from './warehouse-transfer.dto'
import { WarehouseTransfer } from './warehouse-transfer.schema'

@Injectable()
export class WarehouseTransferRepository {
	constructor(@InjectModel('WarehouseTransferSchema')
	private readonly warehouseExportModel: Model<WarehouseTransfer>) { }

	getFilterOptions(condition: WarehouseTransferConditionDto) {
		const filter: FilterQuery<WarehouseTransfer> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		if (condition.timeSync != null) {
			filter.timeSync = condition.timeSync
		}

		return filter
	}

	async findOneBy(condition: WarehouseTransferConditionDto): Promise<WarehouseTransfer> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.warehouseExportModel.findOne(filter)
		return doc.toObject()
	}

	async findManyBy(condition: any): Promise<WarehouseTransfer[]> {
		const docs = await this.warehouseExportModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<WarehouseTransfer>>(data: NoExtraProperties<Partial<WarehouseTransfer>, T>): Promise<WarehouseTransfer> {
		const model = new this.warehouseExportModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<WarehouseTransfer>>(data: NoExtraProperties<Partial<WarehouseTransfer>, T>[]): Promise<WarehouseTransfer[]> {
		const hydratedDocument = await this.warehouseExportModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: WarehouseTransferConditionDto): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.warehouseExportModel.deleteMany(filter)
	}

	async report(filter: { fromTime: Date, toTime: Date, warehouseExportId?: number }): Promise<any> {
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
								...[filter.warehouseExportId ? { warehouseExportId: { $eq: filter.warehouseExportId } } : {}],
							],
						},
						{
							$and: [
								{ documentDate: { $eq: null } },
								{
									transferDate: {
										$gte: filter.fromTime,
										$lt: filter.toTime,
									},
								},
								...[filter.warehouseExportId ? { warehouseExportId: { $eq: filter.warehouseExportId } } : {}],
							],
						},
					],
				},
			},
			{
				$group: {
					_id: {
						warehouseExportId: '$warehouseExportId',
						warehouseExportName: '$warehouseExportName',
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
					warehouseExportId: '$_id.warehouseExportId',
					warehouseExportName: '$_id.warehouseExportName',
					templateCode: '$_id.templateCode',
					templateName: '$_id.templateName',
					amount: 1,
					tickets: 1,
				},
			},
			{
				$group: {
					_id: {
						warehouseExportId: '$warehouseExportId',
						warehouseExportName: '$warehouseExportName',
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
					warehouseExportId: '$_id.warehouseExportId',
					warehouseExportName: '$_id.warehouseExportName',
					amount: 1,
					templates: 1,
				},
			},
			{ $sort: { warehouseExportId: 1 } },
		])
	}
}