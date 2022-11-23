import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { SyncTransactionRequest } from '@requests/sync-transaction.request';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { TransactionItemInterface } from '@schemas/interface/TransactionItem.Interface';
import { TransactionItem } from '@schemas/transaction-item.schema';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { getTimezone } from '@utils/common';
import { FORMAT_DATE } from '@utils/constant';
import { OrderType } from '@enums/order-type.enum';
import { keyBy } from 'lodash';
import { ActionType } from '@enums/report-type.enum';
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

  async saveMany(
    syncTransactionRequest: TransactionItemInterface[],
  ): Promise<any> {
    return this.transactionItem.create(syncTransactionRequest);
  }

  async updateQuantityItem(
    request: ReportRequest,
    condition: any,
    data: DailyWarehouseItemStock[],
  ): Promise<any> {
    const CurTime = moment(getTimezone()).format(FORMAT_DATE);
    const dateRequest = moment(request.dateFrom).format(FORMAT_DATE);
    if (CurTime === dateRequest) {
      const dataTransactionByCurDate = await this.groupByItemPOandSO(condition);

      const keyByItem = keyBy(data, function (o) {
        return [o.warehouseCode, o.itemCode].join('-');
      });

      dataTransactionByCurDate.forEach((item) => {
        let key = [item.warehouseCode, item.itemCode].join('-');
        if (keyByItem[key]) {
          const itemStock = keyByItem[key];
          itemStock.stockQuantity =
            itemStock.stockQuantity +
            item.quantityImported -
            item.quantityExported;
        }
      });
      return dataTransactionByCurDate;
    } else {
      return data;
    }
  }

  async groupByItem(condition: any) {
    const curCondition = condition;
    return this.transactionItem.aggregate([
      { $match: curCondition },
      {
        $project: {
          _id: 0,
          warehouseCode: 1,
          itemCode: 1,
          quantityExported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.EXPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImported: {
            $cond: [
              {
                $eq: ['$actionType', ActionType.IMPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
          },
          quantityExported: { $sum: '$quantityExported' },
          quantityImported: { $sum: '$quantityImported' },
        },
      },
      {
        $project: {
          _id: 0,
          warehouseCode: '$_id.warehouseCode',
          orderCode: '$_id.orderCode',
          itemCode: '$_id.itemCode',
          quantityExported: 1,
          quantityImported: 1,
        },
      },
    ]);
  }

  async groupByItemTransfer(condition: any) {
    const curCondition = condition;

    curCondition['$and'].push({
      orderType: {
        $in: [OrderType.TRANSFER],
      },
    });
    return this.transactionItem.aggregate([
      { $match: curCondition },
      {
        $project: {
          _id: 0,
          warehouseCode: 1,
          itemCode: 1,
          quantityExported: {
            $cond: [
              {
                $eq: ['$orderType', OrderType.EXPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
          quantityImported: {
            $cond: [
              {
                $eq: ['$orderType', OrderType.IMPORT],
              },
              '$actualQuantity',
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
          },
          quantityExported: { $sum: '$quantityExported' },
          quantityImported: { $sum: '$quantityImported' },
        },
      },
      {
        $project: {
          _id: 0,
          warehouseCode: '$_id.warehouseCode',
          orderCode: '$_id.orderCode',
          itemCode: '$_id.itemCode',
          quantityExported: 1,
          quantityImported: 1,
        },
      },
    ]);
  }
}
