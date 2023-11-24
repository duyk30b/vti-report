import { Injectable } from '@nestjs/common'
import { SnapshotItemRequest } from './snapshot-item.request'
import { ItemRepository } from 'src/mongo/repository/item/item.repository'

@Injectable()
export class SnapshotItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async createManyItem({ data }: SnapshotItemRequest) {
    await this.itemRepository.insertManyFullField(data)
  }
}
