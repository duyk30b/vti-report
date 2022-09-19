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
    document.itemId = syncTransactionRequest?.itemId;
    document.lotNumber = syncTransactionRequest?.lotNumber;
    document.stockQuantity = syncTransactionRequest?.stockQuantity;
    document.warehouseId = syncTransactionRequest?.warehouseId;
    document.locatorId = syncTransactionRequest?.locatorId;
    document.planQuantity = syncTransactionRequest?.planQuantity;
    document.storageDate = syncTransactionRequest?.storageDate;
    document.orderId = syncTransactionRequest?.orderId;
    document.orderType = syncTransactionRequest?.orderType;
    await document.save();
  }
}
