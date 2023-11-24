import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { ItemStockDailyConditionDto } from './item-stock-daily.dto'
import { ItemStockDaily, ItemStockDailyType } from './item-stock-daily.schema'

@Injectable()
export class ItemStockDailyRepository {
  constructor(@InjectModel('ItemStockDailySchema') private readonly itemModel: Model<ItemStockDaily>) {}

  getFilterOptions(condition: ItemStockDailyConditionDto) {
    const filter: FilterQuery<ItemStockDaily> = {}

    if (condition.id != null) filter._id = condition.id
    if (condition.ids != null) filter._id = { $in: condition.ids }

    return filter
  }

  async findOneBy(condition: ItemStockDailyConditionDto): Promise<ItemStockDailyType> {
    const filter = this.getFilterOptions(condition)
    const doc = await this.itemModel.findOne(filter)
    return doc.toObject()
  }

  async findManyBy(condition: ItemStockDailyConditionDto): Promise<ItemStockDailyType[]> {
    const docs = await this.itemModel.find(condition).exec()
    return docs.map((i) => i.toObject())
  }

  async insertOne<T extends Partial<ItemStockDailyType>>(
    data: NoExtraProperties<Partial<ItemStockDailyType>, T>
  ): Promise<ItemStockDailyType> {
    const model = new this.itemModel(data)
    const inventorySnap = await model.save()
    return inventorySnap.toObject()
  }

  async insertMany<T extends Partial<ItemStockDailyType>>(
    data: NoExtraProperties<Partial<ItemStockDailyType>, T>[]
  ): Promise<ItemStockDailyType[]> {
    const hydratedDocument = await this.itemModel.insertMany(data)
    return hydratedDocument.map((i: any) => i.toObject())
  }

  async insertManyFullField<T extends ItemStockDailyType>(
    data: NoExtraProperties<ItemStockDailyType, T>[]
  ): Promise<ItemStockDailyType[]> {
    const hydratedDocument = await this.itemModel.insertMany(data)
    return hydratedDocument.map((i: any) => i.toObject())
  }

  async deleteMany(condition: ItemStockDailyConditionDto): Promise<any> {
    const filter = this.getFilterOptions(condition)
    return await this.itemModel.deleteMany(filter)
  }

  async report(filter: { fromTime: Date; toTime: Date; warehouseId?: number }): Promise<any> {
    return await this.itemModel.aggregate([
      {
        $match: {
          timeSync: {
            $gte: filter.fromTime,
            $lt: filter.toTime,
          },
        },
      },
      {
        $group: {
          _id: { warehouseId: '$warehouseId' },
          items: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          warehouseId: '$_id.warehouseId',
          items: 1,
        },
      },
      { $sort: { warehouseId: 1 } },
    ])
  }
}
