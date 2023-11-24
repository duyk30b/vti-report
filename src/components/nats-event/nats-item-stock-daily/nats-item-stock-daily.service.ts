import { Injectable } from '@nestjs/common'
import { ItemStockDailyRepository } from 'src/mongo/repository/item-stock-daily/item-stock-daily.repository'
import { NatsItemStockDailyRequest } from './nats-item-stock-daily.request'

@Injectable()
export class NatsItemStockDailyService {
  constructor(private readonly itemStockDailyRepository: ItemStockDailyRepository) {}

  async createManyItem({ data }: NatsItemStockDailyRequest) {
    await this.itemStockDailyRepository.insertManyFullField(data)
  }
}
