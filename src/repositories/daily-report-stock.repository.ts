import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyReportStock } from '@schemas/daily-report-stock.schema';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { SyncDailyReportStockRequestDto } from '@components/sync/dto/request/sync-daily-report-stock.request';
import { ReportRequest } from '@requests/report.request';
import { DATE_FOMAT, TIMEZONE_HCM_CITY } from '@utils/constant';
import * as moment from 'moment';

@Injectable()
export class DailyReportStockRepository extends BaseAbstractRepository<DailyReportStock> {
  constructor(
    @InjectModel(DailyReportStock.name)
    private readonly dailyReportStock: Model<DailyReportStock>,
  ) {
    super(dailyReportStock);
  }

  createEntity(request: SyncDailyReportStockRequestDto): DailyReportStock {
    const document = new this.dailyReportStock();
    for (const key in request) {
      document[key] = request[key] || '';
    }
    return document;
  }

  async reportItemStockRealtime(request: ReportRequest): Promise<any[]> {
    const condition: any = {
      $expr: {
        $or: [
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment().format(DATE_FOMAT),
            ],
          },
          {
            $eq: [
              {
                $dateToString: {
                  date: '$reportDate',
                  format: '%Y-%m-%d',
                  timezone: TIMEZONE_HCM_CITY,
                },
              },
              moment().subtract(1, 'day').format(DATE_FOMAT),
            ],
          },
        ],
      },
    };

    if (request.warehouseCode) {
      condition.warehouseCode = request.warehouseCode;
    }

    return this.dailyReportStock.aggregate([
      { $match: condition },
      {
        $sort: {
          reportDate: -1,
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            companyName: '$companyName',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
            itemCode: '$itemCode',
            itemName: '$itemName',
            unit: '$unit',
            lotNumber: '$lotNumber',
            productionDate: '$productionDate',
            storageDate: '$storageDate',
            locatorCode: '$locatorCode',
            locatorName: '$locatorName',
          },
          status: {
            $first: '$status',
          },
          stockQuantity: {
            $first: '$stockQuantity',
          },
          reportDate: {
            $first: '$reportDate',
          },
        },
      },
      {
        $group: {
          _id: {
            companyCode: '$_id.companyCode',
            companyName: '$_id.companyName',
            warehouseCode: '$_id.warehouseCode',
            warehouseName: '$_id.warehouseName',
          },
          items: {
            $push: {
              itemCode: '$_id.itemCode',
              itemName: '$_id.itemName',
              unit: '$_id.unit',
              lotNumber: '$_id.lotNumber',
              productionDate: '$_id.productionDate',
              storageDate: '$_id.storageDate',
              locatorCode: '$_id.locatorCode',
              locatorName: '$_id.locatorName',
              status: '$status',
              stockQuantity: '$stockQuantity',
              reportDate: '$reportDate',
            },
          },
        },
      },
      {
        $project: {
          companyCode: '$_id.companyCode',
          companyName: '$_id.companyName',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          reportDate: '$reportDate',
          items: '$items',
          _id: 0,
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

  async reportItemStock(request: ReportRequest): Promise<any[]> {
    const condition: any = {
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
    };

    if (request.warehouseCode) {
      condition.warehouseCode = request.warehouseCode;
    }

    return this.dailyReportStock.aggregate([
      { $match: condition },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            companyName: '$companyName',
            warehouseCode: '$warehouseCode',
            warehouseName: '$warehouseName',
          },
          items: {
            $push: {
              itemCode: '$itemCode',
              itemName: '$itemName',
              unit: '$unit',
              lotNumber: '$lotNumber',
              productionDate: '$productionDate',
              storageDate: '$storageDate',
              locatorCode: '$locatorCode',
              locatorName: '$locatorName',
              status: '$status',
              stockQuantity: '$stockQuantity',
            },
          },
        },
      },
      {
        $project: {
          companyCode: '$_id.companyCode',
          companyName: '$_id.companyName',
          warehouseCode: '$_id.warehouseCode',
          warehouseName: '$_id.warehouseName',
          items: '$items',
          _id: 0,
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
}
