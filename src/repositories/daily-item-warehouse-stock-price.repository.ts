import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { getTimezone } from '@utils/common';
import { DATE_FOMAT, FORMAT_DATE } from '@utils/constant';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { DailyItemWarehouseStockPrice } from '@schemas/daily-item-warehouse-stock-price.schema';
import { DataItemWarehousePriceRequestDto } from '@components/sync/dto/request/sync-item-warehouse-stock-price.request.dto';
import { ReportItemStockHistoriesRequestDto } from '@components/dashboard/dto/request/report-item-stock-histories.request.dto';

@Injectable()
export class DailyItemWarehouseStockPriceRepository extends BaseAbstractRepository<DailyItemWarehouseStockPrice> {
  constructor(
    @InjectModel(DailyItemWarehouseStockPrice.name)
    private readonly dailyItemLocatorStockPrice: Model<DailyItemWarehouseStockPrice>,
  ) {
    super(dailyItemLocatorStockPrice);
  }

  createDocument(
    dailyItemStockLocator: DataItemWarehousePriceRequestDto,
  ): DailyItemWarehouseStockPrice {
    const document = new this.dailyItemLocatorStockPrice();
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.warehouseCode = dailyItemStockLocator?.warehouseCode;
    document.lotNumber = dailyItemStockLocator?.lotNumber;
    document.quantity = dailyItemStockLocator?.quantity;
    document.price = dailyItemStockLocator?.amount;
    document.amount = dailyItemStockLocator?.totalAmount;
    document.reportDate = new Date(dailyItemStockLocator.reportDate);
    document.companyCode = dailyItemStockLocator?.companyCode;
    document.manufacturingCountry = dailyItemStockLocator?.manufacturingCountry;
    return document;
  }

  async getInforItemStock(request: ReportRequest): Promise<any> {
    const condition = {
      $and: [{}],
    };

    if (request?.dateFrom)
      request.dateFrom = getTimezone(request?.dateFrom, FORMAT_DATE);
    if (request?.dateFrom == getTimezone(undefined, FORMAT_DATE)) {
      const prevDate = new Date(request?.dateFrom);
      prevDate.setDate(prevDate.getDate() - 1);
      condition['$and'].push({
        $expr: {
          $gte: [
            { $dateToString: { date: '$reportDate', format: '%Y-%m-%d' } },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      condition['$and'].push({
        $expr: {
          $gte: [
            { $dateToString: { date: '$reportDate', format: '%Y-%m-%d' } },
            moment(request?.dateFrom).format(DATE_FOMAT),
          ],
        },
      });
    }
    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });
    return this.dailyItemLocatorStockPrice.aggregate([
      { $match: condition },
      { $sort: { reportDate: -1 } },
      {
        $project: {
          _id: 0,
          warehouseCode: 1,
          companyCode: 1,
          itemCode: 1,
          lotNumber: 1,
          quantity: 1,
          price: 1,
          amount: 1,
          reportDate: 1,
          manufacturingCountry: 1,
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
            lotNumber: '$lotNumber',
          },
          manufacturingCountry: { $first: '$manufacturingCountry' },
          quantity: { $first: '$quantity' },
          price: { $first: '$price' },
          amount: { $first: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          warehouseCode: '$_id.warehouseCode',
          itemCode: '$_id.itemCode',
          lotNumber: '$_id.lotNumber',
          quantity: 1,
          price: 1,
          amount: 1,
          reportDate: 1,
          manufacturingCountry: 1,
        },
      },
    ]);
  }

  async getItemStockHistories(
    startDate,
    endDate,
    request: ReportItemStockHistoriesRequestDto,
  ): Promise<any> {
    const { warehouseCode, itemCode, companyCode } = request;
    const conditions = {
      $and: [
        {
          reportDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      ],
    } as any;
    if (warehouseCode) {
      conditions['$and'].push({
        warehouseCode: { $eq: warehouseCode },
      });
    }
    if (itemCode) {
      conditions['$and'].push({
        itemCode: { $eq: itemCode },
      });
    }
    if (companyCode) {
      conditions['$and'].push({
        companyCode: { $eq: companyCode },
      });
    }
    const aggregateState = [
      {
        $match: conditions,
      },
      {
        $group: {
          _id: {
            reportDate: '$reportDate',
          },
          quantity: { $sum: '$quantity' },
          amount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          reportDate: '$_id.reportDate',
          quantity: 1,
          amount: 1,
        },
      },
      {
        $sort: {
          reportDate: 1,
        },
      },
    ];

    return await this.dailyItemLocatorStockPrice.aggregate(aggregateState);
  }
}
