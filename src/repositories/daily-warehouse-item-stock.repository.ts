import { SyncDailyItemStockWarehouseRequestDto } from '@components/sync/dto/request/sync-daily-item-stock-warehouse.request.dto';
import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { ReportType } from '@enums/report-type.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemRequest } from '@requests/sync-daily.request';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { getTimezone, plus } from '@utils/common';
import { DATE_FOMAT, FORMAT_DATE } from '@utils/constant';
import * as moment from 'moment';
import { Model } from 'mongoose';

@Injectable()
export class DailyWarehouseItemStockRepository extends BaseAbstractRepository<DailyWarehouseItemStock> {
  constructor(
    @InjectModel(DailyWarehouseItemStock.name)
    private readonly dailyWarehouseItemStock: Model<DailyWarehouseItemStock>,
  ) {
    super(dailyWarehouseItemStock);
  }

  createEntity(
    dailyItemStockLocator: SyncDailyItemStockWarehouseRequestDto,
  ): DailyWarehouseItemStock {
    const document = new this.dailyWarehouseItemStock();
    document.itemName = dailyItemStockLocator?.itemName;
    document.itemCode = dailyItemStockLocator?.itemCode;
    document.unit = dailyItemStockLocator.unit;
    document.warehouseName = dailyItemStockLocator?.warehouseName;
    document.warehouseCode = dailyItemStockLocator?.warehouseCode;
    document.companyCode = dailyItemStockLocator?.companyCode;
    document.companyName = dailyItemStockLocator?.companyName;
    document.companyAddress = dailyItemStockLocator?.companyAddress;
    document.reportDate = dailyItemStockLocator?.reportDate;
    document.stockQuantity = dailyItemStockLocator?.stockQuantity;
    return document;
  }

  async createMany(
    dailyWarehouseItemRequests: DailyWarehouseItemRequest[],
  ): Promise<void> {
    for (const dailyWarehouseItemRequest of dailyWarehouseItemRequests) {
      const document = new this.dailyWarehouseItemStock();
      Object.assign(document, dailyWarehouseItemRequest);

      await document.save();
    }
  }

  async getReports(request: ReportRequest): Promise<DailyWarehouseItemStock[]> {
    const condition = {
      $and: [],
    };
    const conditionQuantity = {
      $and: [],
    };

    switch (request?.reportType) {
      case ReportType.ITEM_INVENTORY_BELOW_SAFE:
        conditionQuantity['$and'].push({
          $expr: {
            $lt: [`$stockQuantity`, `$inventoryLimit`],
          },
        });
        break;
      case ReportType.ITEM_INVENTORY_BELOW_MINIMUM:
        conditionQuantity['$and'].push({
          $expr: {
            $lt: [`$stockQuantity`, `$minInventoryLimit`],
          },
        });
        break;

      default:
        break;
    }

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
    console.log(JSON.stringify(condition));

    return this.dailyWarehouseItemStock.aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'inventory-quantity-norms',
          let: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$companyCode', '$$companyCode'] },
                    { $eq: ['$warehouseCode', '$$warehouseCode'] },
                    { $eq: ['$itemCode', '$$itemCode'] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                companyCode: 1,
                warehouseCode: 1,
                itemCode: 1,
                inventoryLimit: 1,
                minInventoryLimit: 1,
              },
            },
          ],
          as: 'inventory-quantity-norms',
        },
      },
      { $unwind: { path: '$inventory-quantity-norms' } },
      {
        $project: {
          _id: 0,
          itemName: 1,
          itemCode: 1,
          unit: 1,
          warehouseName: 1,
          warehouseCode: 1,
          companyAddress: 1,
          companyCode: 1,
          companyName: 1,
          reportDate: 1,
          stockQuantity: 1,
          inventoryLimit: '$inventory-quantity-norms.inventoryLimit',
          minInventoryLimit: '$inventory-quantity-norms.minInventoryLimit',
        },
      },
      { $match: conditionQuantity },
      { $sort: { warehouseCode: 1, itemCode: 1, stockQuantity: 1 } },
    ]);
  }
}
