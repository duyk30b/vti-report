import { SyncDailyItemLotStockLocatorRequestDto } from '@components/sync/dto/request/sync-daily-item-stock-warehouse.request.dto';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { OrderType } from '@enums/order-type.enum';
import { ActionType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemRequest } from '@requests/sync-daily.request';
import { SyncItemStockLocatorByDate } from '@requests/sync-item-stock-locator-by-date';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { getTimezone } from '@utils/common';
import { DATE_FOMAT, FORMAT_DATE, MONTHS, YEARS } from '@utils/constant';
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
    return document;
  }

  async createMany(
    dailyWarehouseItemRequests: DailyWarehouseItemRequest[],
  ): Promise<void> {
    for (const dailyWarehouseItemRequest of dailyWarehouseItemRequests) {
      for (const dailyItemLocatorStock of dailyWarehouseItemRequest.dailyItemLocatorStocks) {
        for (const dailyLotLocatorStock of dailyItemLocatorStock.dailyLotLocatorStocks) {
          const document = new this.dailyLotLocatorStock();
          Object.assign(
            document,
            dailyWarehouseItemRequest,
            dailyItemLocatorStock,
            dailyLotLocatorStock,
          );
          await document.save();
        }
      }
    }
  }

  async getReports(request: ReportRequest): Promise<DailyLotLocatorStock[]> {
    const condition = {
      $and: [],
    };

    if (request?.dateFrom == getTimezone(undefined, FORMAT_DATE)) {
      const prevDate = new Date(request?.dateFrom);
      prevDate.setDate(prevDate.getDate() - 1);
      condition['$and'].push({
        $expr: {
          $eq: [
            { $dateToString: { date: '$reportDate', format: '%Y-%m-%d' } },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
    } else {
      condition['$and'].push({
        $expr: {
          $eq: [
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

    return this.dailyLotLocatorStock
      .find(condition)
      .sort({ warehouseCode: 1, itemCode: 1, lotNumber: 1, stockQuantity: 1 })
      .lean();
  }

  async getReportItemInventory(request: ReportRequest): Promise<any[]> {
    const curDate = getTimezone(undefined, FORMAT_DATE);
    const prevDate = new Date(curDate);
    prevDate.setDate(prevDate.getDate() - 1);
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
                $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
              },
              moment(request?.dateFrom).format(DATE_FOMAT),
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
                $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
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
    let isCurDateStockStartDate = false;
    let isCurBoth = false;
    if (
      request?.dateFrom === request?.dateTo &&
      request?.dateFrom === curDate
    ) {
      isCurBoth = true;
      conditionStockQuantity['stockStart'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
              },
              moment(prevDate).format(DATE_FOMAT),
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
                $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
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
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
            },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });
    } else if (request?.dateFrom === curDate) {
      isCurDateStockStartDate = true;
      conditionStockQuantity['stockStart'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
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
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
            },
            moment(prevDate).format(DATE_FOMAT),
          ],
        },
      });

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
            },
            moment(request?.dateTo).format(DATE_FOMAT),
          ],
        },
      });
    } else if (request?.dateTo === curDate) {
      conditionStockQuantity['stockEnd'] = {
        $cond: [
          {
            $eq: [
              {
                $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
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
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
            },
            moment(request.dateFrom).format(DATE_FOMAT),
          ],
        },
      });

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
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
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
            },
            moment(request.dateFrom).format(DATE_FOMAT),
          ],
        },
      });

      condition['$or'].push({
        $expr: {
          $eq: [
            {
              $dateToString: { date: '$reportDate', format: '%Y-%m-%d' },
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

    condition['$and'].push({
      $expr: {
        $eq: [
          { $dateToString: { date: '$reportDate', format: '%Y-%m-%d' } },
          moment(request?.dateFrom).format(DATE_FOMAT),
        ],
      },
    });
    return this.dailyLotLocatorStock.aggregate([
      {
        $match: condition,
      },
      {
        $sort: { storageDate: -1 },
      },
      {
        $project: {
          companyCode: '$companyCode',
          companyName: '$companyName',
          companyAddress: '$companyAddress',
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
          storageCost: '$storageCost',
          totalPrice: { $multiply: ['$storageCost', '$stockQuantity'] },
          ...getQueryAgeOfItems(),
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            companyName: '$companyName',
            companyAddress: '$companyAddress',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
          },
          groupByStorageDate: {
            $push: {
              storageDate: '$storageDate',
              origin: '$origin',
              account: '$account',
              lotNumber: '$lotNumber',
              locatorCode: '$locatorCode',
              unit: '$unit',
              stockQuantity: '$stockQuantity',
              storageCost: '$storageCost',
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
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
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
              greaterfiveYear: { $sum: '$groupByStorageDate.greaterfiveYear' },
              groupByStorageDate: '$groupByStorageDate',
            },
          },
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$_id.companyCode',
            companyName: '$_id.companyName',
            companyAddress: '$_id.companyAddress',
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
  return {
    sixMonthAgo: {
      $cond: [
        {
          $gt: [
            {
              $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
            },
            sixMonthAgo,
          ],
        },
        { $multiply: ['$storageCost', '$stockQuantity'] },
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
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                sixMonthAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                oneYearAgo,
              ],
            },
          ],
        },
        { $multiply: ['$storageCost', '$stockQuantity'] },
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
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                oneYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                twoYearAgo,
              ],
            },
          ],
        },
        { $multiply: ['$storageCost', '$stockQuantity'] },
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
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                twoYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                threeYearAgo,
              ],
            },
          ],
        },
        { $multiply: ['$storageCost', '$stockQuantity'] },
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
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                threeYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                fourYearAgo,
              ],
            },
          ],
        },
        { $multiply: ['$storageCost', '$stockQuantity'] },
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
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                fourYearAgo,
              ],
            },
            {
              $gt: [
                {
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                fiveYearAgo,
              ],
            },
          ],
        },
        { $multiply: ['$storageCost', '$stockQuantity'] },
        0,
      ],
    },
    greaterfiveYear: {
      $cond: [
        {
          $and: [
            {
              $lt: [
                {
                  $dateToString: { date: '$storageDate', format: '%Y-%m-%d' },
                },
                fiveYearAgo,
              ],
            },
          ],
        },
        { $multiply: ['$storageCost', '$stockQuantity'] },
        0,
      ],
    },
  };
}
