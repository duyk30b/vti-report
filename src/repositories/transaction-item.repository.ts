import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SyncTransactionRequest } from '@requests/sync-transaction.request';
import { TransactionItem } from '@schemas/transaction-item.schema';
import { Model } from 'mongoose';

@Injectable()
export class TransactionItemRepository extends BaseAbstractRepository<TransactionItem> {
  constructor(
    @InjectModel(TransactionItem.name)
    private readonly transactionItem: Model<TransactionItem>,
  ) {
    super(transactionItem);
  }

  async createOne(
    syncTransactionRequest: SyncTransactionRequest,
  ): Promise<void> {
    const document = new this.transactionItem();
    Object.assign(document, syncTransactionRequest);
    await document.save();
  }
}
