import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { ItemConditionDto } from './item.dto'
import { Item, ItemType } from './item.schema'

@Injectable()
export class ItemRepository {
  constructor(@InjectModel('ItemSchema') private readonly itemModel: Model<Item>) {}

  getFilterOptions(condition: ItemConditionDto) {
    const filter: FilterQuery<Item> = {}

    if (condition.id != null) filter._id = condition.id
    if (condition.ids != null) filter._id = { $in: condition.ids }

    return filter
  }

  async findOneBy(condition: ItemConditionDto): Promise<ItemType> {
    const filter = this.getFilterOptions(condition)
    const doc = await this.itemModel.findOne(filter)
    return doc.toObject()
  }

  async findManyBy(condition: ItemConditionDto): Promise<ItemType[]> {
    const docs = await this.itemModel.find(condition).exec()
    return docs.map((i) => i.toObject())
  }

  async insertOne<T extends Partial<ItemType>>(data: NoExtraProperties<Partial<ItemType>, T>): Promise<ItemType> {
    const model = new this.itemModel(data)
    const inventorySnap = await model.save()
    return inventorySnap.toObject()
  }

  async insertMany<T extends Partial<ItemType>>(data: NoExtraProperties<Partial<ItemType>, T>[]): Promise<ItemType[]> {
    const hydratedDocument = await this.itemModel.insertMany(data)
    return hydratedDocument.map((i: any) => i.toObject())
  }

  async insertManyFullField<T extends ItemType>(data: NoExtraProperties<ItemType, T>[]): Promise<ItemType[]> {
    const hydratedDocument = await this.itemModel.insertMany(data)
    return hydratedDocument.map((i: any) => i.toObject())
  }

  async deleteMany(condition: ItemConditionDto): Promise<any> {
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
