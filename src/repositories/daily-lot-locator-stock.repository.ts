import { ReportItemStockHistoriesRequestDto } from '@components/dashboard/dto/request/report-item-stock-histories.request.dto';
import { SyncDailyItemLotStockLocatorRequestDto } from '@components/sync/dto/request/sync-daily-item-stock-warehouse.request.dto';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ActionType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemRequest } from '@requests/sync-daily.request';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { getTimezone } from '@utils/common';
import {
  DATE_FOMAT,
  DATE_FOMAT_EXCELL,
  FORMAT_DATE,
  MONTHS,
  TIMEZONE_HCM_CITY,
  YEARS,
} from '@utils/constant';
import * as moment from 'moment';
import { Model } from 'mongoose';
@Injectable()
export class DailyLotLocatorStockRepository extends BaseAbstractRepository<DailyLotLocatorStock> {
  constructor(
    @InjectModel(DailyLotLocatorStock.name)
    private readonly dailyLotLocatorStock: Model<DailyLotLocatorStock>,
  ) {
    super(dailyLotLocatorStock);
  }

  createEntity(
    dailyItemStockLocator: SyncDailyItemLotStockLocatorRequestDto,
  ): DailyLotLocatorStock {
    const document = new this.dailyLotLocatorStock();
    document.itemName = dailyItemStockLocator?.itemName;
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.unit = dailyItemStockLocator.unit;
    document.warehouseName = dailyItemStockLocator?.warehouseName;
    document.warehouseCode = dailyItemStockLocator?.warehouseCode;
    document.locatorName = dailyItemStockLocator?.locatorName;
    document.locatorCode = dailyItemStockLocator?.locatorCode;
    document.companyCode = dailyItemStockLocator?.companyCode;
    document.companyName = dailyItemStockLocator?.companyName;
    document.companyAddress = dailyItemStockLocator?.companyAddress;
    document.reportDate = dailyItemStockLocator?.reportDate;
    document.stockQuantity = dailyItemStockLocator?.stockQuantity;
    document.lotNumber = dailyItemStockLocator?.lotNumber;
    document.storageDate = dailyItemStockLocator?.storageDate;
    document.stockQuantity = dailyItemStockLocator?.stockQuantity;
    document.account = dailyItemStockLocator?.account;
    document.origin = dailyItemStockLocator?.origin;
    return document;
  }

  async getReports(request: ReportRequest): Promise<DailyLotLocatorStock[]> {
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
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      condition['$and'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
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
    return this.dailyLotLocatorStock.aggregate([
      { $match: condition },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          warehouseCode: 1,
          warehouseName: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          lotNumber: 1,
          locatorCode: 1,
          stockQuantity: 1,
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemName: '$itemName',
            unit: '$unit',
            lotNumber: '$lotNumber',
            itemCode: '$itemCode',
            locatorCode: '$locatorCode',
          },
          stockQuantity: { $sum: '$stockQuantity' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          itemCode: '$_id.itemCode',
          itemName: '$_id.itemName',
          unit: '$_id.unit',
          lotNumber: '$_id.lotNumber',
          locatorCode: '$_id.locatorCode',
          stockQuantity: 1,
        },
      },
      {
        $sort: {
          warehouseCode: 1,
          itemCode: 1,
          lotNumber: 1,
          stockQuantity: 1,
        },
      },
    ]);
  }

  async getReportItemInventory(request: ReportRequest): Promise<any[]> {
    const curDate = getTimezone(undefined, FORMAT_DATE);
    const prevDate = new Date(curDate);
    prevDate.setDate(prevDate.getDate() - 1);
    let dateFromSubtractOne = new Date(request?.dateFrom);
    dateFromSubtractOne.setDate(dateFromSubtractOne.getDate() - 1);
    dateFromSubtractOne = getTimezone(dateFromSubtractOne, FORMAT_DATE);
    const condition = {
      $and: [],
    };

    if (request?.companyCode) {
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    }
    if (request?.warehouseCode) {
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });
    }

    //Điều kiện hàng tồn kho đầu và cuối kỳ
    const conditionStockQuantity = {
      stockStart: {
        $cond: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              dateFromSubtractOne,
            ],
          },
          '$stockQuantity',
          0,
        ],
      },
      stockEnd: {
        $cond: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment(request?.dateTo).format(DATE_FOMAT),
            ],
          },
          '$stockQuantity',
          0,
        ],
      },
    };

    //================
    if (
      request?.dateFrom === request?.dateTo &&
      request?.dateFrom === curDate
    ) {
      dateFromSubtractOne = new Date(dateFromSubtractOne);
      dateFromSubtractOne.setDate(dateFromSubtractOne.getDate() - 1);
      dateFromSubtractOne = getTimezone(dateFromSubtractOne, FORMAT_DATE);

      conditionStockQuantity['stockStart'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment(prevDate).format(DATE_FOMAT) as any,
            ],
          },
          '$stockQuantity',
          0,
        ],
      };
      conditionStockQuantity['stockEnd'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment(prevDate).format(DATE_FOMAT),
            ],
          },
          '$stockQuantity',
          0,
        ],
      };
      if (!condition['$or']) condition['$or'] = [];
      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
    } else if (request?.dateFrom === curDate) {
      conditionStockQuantity['stockStart'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment(prevDate).format(DATE_FOMAT) as any,
            ],
          },
          '$stockQuantity',
          0,
        ],
      };
      if (!condition['$or']) condition['$or'] = [];

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(request?.dateTo).format(DATE_FOMAT),
          ],
        },
      });
    } else if (request?.dateTo === curDate) {
      conditionStockQuantity['stockStart'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment(dateFromSubtractOne).format(DATE_FOMAT) as any,
            ],
          },
          '$stockQuantity',
          0,
        ],
      };
      conditionStockQuantity['stockEnd'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment(prevDate).format(DATE_FOMAT),
            ],
          },
          '$stockQuantity',
          0,
        ],
      };
      if (!condition['$or']) condition['$or'] = [];

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            dateFromSubtractOne,
          ],
        },
      });

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      if (!condition['$or']) condition['$or'] = [];
      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(dateFromSubtractOne).format(DATE_FOMAT),
          ],
        },
      });

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%Y-%m-%d',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(request.dateTo).format(DATE_FOMAT),
          ],
        },
      });
    }

    const aggregateState = [];
    aggregateState.push({
      $match: condition,
    });
    aggregateState.push({
      $project: {
        companyCode: 1,
        companyName: 1,
        companyAddress: 1,
        warehouseCode: 1,
        warehouseName: 1,
        itemCode: 1,
        itemName: 1,
        unit: 1,
        lotNumber: 1,
        storageCost: 1,
        note: 1,
        ...conditionStockQuantity,
      },
    });
    aggregateState.push({
      $group: {
        _id: {
          companyCode: '$companyCode',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
          warehouseCode: '$warehouseCode',
          warehouseName: '$warehouseName',
          itemCode: '$itemCode',
          itemName: '$itemName',
          unit: '$unit',
          lotNumber: '$lotNumber',
          storageCost: '$storageCost',
          note: '$note',
        },
        stockStart: { $sum: '$stockStart' },
        stockEnd: { $sum: '$stockEnd' },
      },
    });

    aggregateState.push(
      {
        $group: {
          _id: {
            companyCode: '$_id.companyCode',
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
          },
          items: {
            $push: {
              itemCode: '$_id.itemCode',
              itemName: '$_id.itemName',
              unit: '$_id.unit',
              lotNumber: '$_id.lotNumber',
              storageCost: '$_id.storageCost',
              stockStart: '$stockStart',
              totalStockStart: {
                $multiply: ['$_id.storageCost', '$stockStart'],
              },
              stockEnd: '$stockEnd',
              totalStockEnd: {
                $multiply: ['$_id.storageCost', '$stockEnd'],
              },
              note: '$_id.note',
            },
          },
        },
      },
      {
        $sort: { warehouseCode: -1, itemCode: -1 },
      },
      {
        $unwind: { path: '$items' },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          companyName: '$_id.companyName',
          companyAddress: '$_id.companyAddress',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          itemCode: '$items.itemCode',
          itemName: '$items.itemName',
          unit: '$items.unit',
          lotNumber: '$items.lotNumber',
          storageCost: '$items.storageCost',
          stockStart: '$items.stockStart',
          totalStockStart: '$items.totalStockStart',
          stockEnd: '$items.stockEnd',
          totalStockEnd: '$items.totalStockEnd',
          note: '$items.note',
        },
      },
      {
        $sort: {
          warehouseCode: -1,
          itemCode: -1,
          stockStart: -1,
          stockEnd: -1,
        },
      },
    );
    return this.dailyLotLocatorStock.aggregate(aggregateState);
  }

  async getReportAgeOfItemStock(
    request: ReportRequest,
  ): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };

    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });

    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    if (request?.dateFrom == getTimezone(undefined, FORMAT_DATE)) {
      const prevDate = new Date(request?.dateFrom);
      prevDate.setDate(prevDate.getDate() - 1);
      condition['$and'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%d/%m/%Y',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(prevDate).format(DATE_FOMAT_EXCELL),
          ],
        },
      });
    } else {
      condition['$and'].push({
        $expr: {
          $eq: [
            {
              $dateToString: {
                date: '$reportDate',
                format: '%d/%m/%Y',
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            moment(request?.dateFrom).format(DATE_FOMAT_EXCELL),
          ],
        },
      });
    }

    const aggregate: any[] = [
      {
        $match: condition,
      },
      {
        $sort: { storageDate: 1 },
      },
    ];
    aggregate.push(
      ...[
        {
          $project: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
            storageDate: '$storageDate',
            origin: '$origin',
            account: '$account',
            lotNumber: '$lotNumber',
            locatorCode: '$locatorCode',
            unit: '$unit',
            storageCost: '$storageCost',
            stockQuantity: '$stockQuantity',
          },
        },
        {
          $lookup: {
            from: 'daily-item-warehouse-stock-price',
            let: {
              companyCodeMap: '$companyCode',
              warehouseCodeMap: '$warehouseCode',
              itemCodeMap: '$itemCode',
              lotNumberMap: '$lotNumber',
            },
            pipeline: [
              {
                $sort: { reportDate: -1 },
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$companyCode', '$$companyCodeMap'] },
                      { $eq: ['$warehouseCode', '$$warehouseCodeMap'] },
                      { $eq: ['$itemCode', '$$itemCodeMap'] },
                      { $eq: ['$lotNumber', '$$lotNumberMap'] },
                    ],
                  },
                },
              },
              {
                $project: {
                  price: 1,
                  quantity: 1,
                  averagePrice: {
                    $cond: {
                      if: '$quantity',
                      then: {
                        $divide: ['$price', '$quantity'],
                      },
                      else: 0,
                    },
                  },
                },
              },
            ],
            as: 'priceItem',
          },
        },
        {
          $project: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
            storageDate: '$storageDate',
            origin: '$origin',
            account: '$account',
            lotNumber: '$lotNumber',
            locatorCode: '$locatorCode',
            unit: '$unit',
            stockQuantity: '$stockQuantity',
            storageCost: { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            totalPrice: {
              $multiply: [
                { $arrayElemAt: ['$priceItem.averagePrice', 0] },
                '$stockQuantity',
              ],
            },
            ...getQueryAgeOfItems(),
          },
        },
        {
          $group: {
            _id: {
              companyCode: '$companyCode',
              warehouseCode: '$warehouseCode',
              warehouseName: '$warehouseName',
              itemCode: '$itemCode',
              itemName: '$itemName',
              origin: '$origin',
              account: '$account',
              lotNumber: '$lotNumber',
              locatorCode: '$locatorCode',
              unit: '$unit',
              storageCost: '$storageCost',
              storageDate: {
                $dateToString: {
                  format: '%d/%m/%Y',
                  date: '$storageDate',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
            },
            stockQuantity: { $sum: '$stockQuantity' },
            totalPrice: { $first: '$totalPrice' },
            sixMonthAgo: { $first: '$sixMonthAgo' },
            oneYearAgo: { $first: '$oneYearAgo' },
            twoYearAgo: { $first: '$twoYearAgo' },
            threeYearAgo: { $first: '$threeYearAgo' },
            fourYearAgo: { $first: '$fourYearAgo' },
            fiveYearAgo: { $first: '$fiveYearAgo' },
            greaterfiveYear: { $first: '$greaterfiveYear' },
          },
        },
        {
          $group: {
            _id: {
              companyCode: '$_id.companyCode',
              warehouseCode: '$_id.warehouseCode',
              warehouseName: '$_id.warehouseName',
              itemCode: '$_id.itemCode',
              itemName: '$_id.itemName',
            },
            groupByStorageDate: {
              $push: {
                storageDate: '$_id.storageDate',
                origin: '$_id.origin',
                account: '$_id.account',
                lotNumber: '$_id.lotNumber',
                locatorCode: '$_id.locatorCode',
                unit: '$_id.unit',
                stockQuantity: '$stockQuantity',
                storageCost: '$_id.storageCost',
                totalPrice: '$totalPrice',
                sixMonthAgo: '$sixMonthAgo',
                oneYearAgo: '$oneYearAgo',
                twoYearAgo: '$twoYearAgo',
                threeYearAgo: '$threeYearAgo',
                fourYearAgo: '$fourYearAgo',
                fiveYearAgo: '$fiveYearAgo',
                greaterfiveYear: '$greaterfiveYear',
              },
            },
          },
        },
        {
          $group: {
            _id: {
              warehouseCode: '$_id.warehouseCode',
              warehouseName: '$_id.warehouseName',
              companyCode: '$_id.companyCode',
            },
            items: {
              $push: {
                itemCode: '$_id.itemCode',
                itemName: '$_id.itemName',
                totalQuantity: { $sum: '$groupByStorageDate.stockQuantity' },
                totalPrice: { $sum: '$groupByStorageDate.totalPrice' },
                sixMonthAgo: { $sum: '$groupByStorageDate.sixMonthAgo' },
                oneYearAgo: { $sum: '$groupByStorageDate.oneYearAgo' },
                twoYearAgo: { $sum: '$groupByStorageDate.twoYearAgo' },
                threeYearAgo: { $sum: '$groupByStorageDate.threeYearAgo' },
                fourYearAgo: { $sum: '$groupByStorageDate.fourYearAgo' },
                fiveYearAgo: { $sum: '$groupByStorageDate.fiveYearAgo' },
                greaterfiveYear: {
                  $sum: '$groupByStorageDate.greaterfiveYear',
                },
                groupByStorageDate: '$groupByStorageDate',
              },
            },
          },
        },
        {
          $group: {
            _id: {
              companyCode: '$_id.companyCode',
            },
            warehouses: {
              $push: {
                warehouseCode: '$_id.warehouseCode',
                warehouseName: '$_id.warehouseName',
                totalPrice: { $sum: '$items.totalPrice' },
                sixMonth: { $sum: '$items.sixMonthAgo' },
                oneYearAgo: { $sum: '$items.oneYearAgo' },
                twoYearAgo: { $sum: '$items.twoYearAgo' },
                threeYearAgo: { $sum: '$items.threeYearAgo' },
                fourYearAgo: { $sum: '$items.fourYearAgo' },
                fiveYearAgo: { $sum: '$items.fiveYearAgo' },
                greaterfiveYear: { $sum: '$items.greaterfiveYear' },
                items: '$items',
              },
            },
          },
        },
      ],
    );
    return this.dailyLotLocatorStock.aggregate(aggregate);
  }

  async getReportReOrderQuantity(request: ReportRequest): Promise<any[]> {
    const condition = {
      $and: [{}],
    };
    const prevDate = new Date(request?.dateFrom);
    prevDate.setDate(prevDate.getDate() - 1);
    condition['$and'].push({
      $expr: {
        $eq: [
          {
            $dateToString: {
              date: '$reportDate',
              format: '%Y-%m-%d',
              timezone: TIMEZONE_HCM_CITY,
            },
          },
          moment(prevDate).format(DATE_FOMAT),
        ],
      },
    });
    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });
    return this.dailyLotLocatorStock.aggregate([
      { $match: condition },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
          },
          warehouseName: { $first: '$warehouseName' },
          unit: { $first: '$unit' },
          itemName: { $first: '$itemName' },
          stockQuantity: { $sum: '$stockQuantity' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          warehouseCode: '$_id.warehouseCode',
          itemCode: '$_id.itemCode',
          warehouseName: 1,
          itemName: 1,
          unit: 1,
          stockQuantity: 1,
          key: {
            $concat: [
              { $ifNull: ['$_id.companyCode', ''] },
              '-',
              { $ifNull: ['$_id.warehouseCode', ''] },
              '-',
              { $ifNull: ['$_id.itemCode', ''] },
            ],
          },
        },
      },
      {
        $sort: {
          warehouseCode: 1,
          itemCode: 1,
          stockQuantity: 1,
        },
      },
    ]);
  }
}

function getQueryAgeOfItems(sum = false) {
  const sixMonthAgo = moment().subtract(6, MONTHS).format(FORMAT_DATE);
  const oneYearAgo = moment().subtract(1, YEARS).format(FORMAT_DATE);
  const twoYearAgo = moment().subtract(2, YEARS).format(FORMAT_DATE);
  const threeYearAgo = moment().subtract(3, YEARS).format(FORMAT_DATE);
  const fourYearAgo = moment().subtract(4, YEARS).format(FORMAT_DATE);
  const fiveYearAgo = moment().subtract(5, YEARS).format(FORMAT_DATE);
  const a = '%Y-%m-%d';
  return {
    sixMonthAgo: {
      $cond: [
        {
          $gt: [
            {
              $dateToString: {
                date: '$storageDate',
                format: a,
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            sixMonthAgo,
          ],
        },
        {
          $multiply: [
            { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            '$stockQuantity',
          ],
        },
        0,
      ],
    },
    oneYearAgo: {
      $cond: [
        {
          $and: [
            {
              $lte: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                sixMonthAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                oneYearAgo,
              ],
            },
          ],
        },
        {
          $multiply: [
            { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            '$stockQuantity',
          ],
        },
        0,
      ],
    },
    twoYearAgo: {
      $cond: [
        {
          $and: [
            {
              $lte: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                oneYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                twoYearAgo,
              ],
            },
          ],
        },
        {
          $multiply: [
            { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            '$stockQuantity',
          ],
        },
        0,
      ],
    },
    threeYearAgo: {
      $cond: [
        {
          $and: [
            {
              $lte: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                twoYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                threeYearAgo,
              ],
            },
          ],
        },
        {
          $multiply: [
            { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            '$stockQuantity',
          ],
        },
        0,
      ],
    },
    fourYearAgo: {
      $cond: [
        {
          $and: [
            {
              $lte: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                threeYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                fourYearAgo,
              ],
            },
          ],
        },
        {
          $multiply: [
            { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            '$stockQuantity',
          ],
        },
        0,
      ],
    },
    fiveYearAgo: {
      $cond: [
        {
          $and: [
            {
              $lte: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                fourYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: {
                    date: '$storageDate',
                    format: a,
                    timezone: TIMEZONE_HCM_CITY,
                  },
                },
                fiveYearAgo,
              ],
            },
          ],
        },
        {
          $multiply: [
            { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            '$stockQuantity',
          ],
        },
        0,
      ],
    },
    greaterfiveYear: {
      $cond: [
        {
          $lte: [
            {
              $dateToString: {
                date: '$storageDate',
                format: a,
                timezone: TIMEZONE_HCM_CITY,
              },
            },
            fiveYearAgo,
          ],
        },
        {
          $multiply: [
            { $arrayElemAt: ['$priceItem.averagePrice', 0] },
            '$stockQuantity',
          ],
        },
        0,
      ],
    },
  };
}
