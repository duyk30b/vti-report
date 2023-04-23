import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryQuantityNormModel } from '@schemas/inventory-quantity-norms.model';
import { InventoryQuantityNormsInterface } from '@schemas/interface/inventory-quantity-norms';
import { ReportType } from '@enums/report-type.enum';
import { getTimezone } from '@utils/common';
import { ReportRequest } from '@requests/report.request';
import { FORMAT_DATE } from '@utils/constant';
import * as moment from 'moment';
@Injectable()
export class InventoryQuantityNormsRepository extends BaseAbstractRepository<InventoryQuantityNormModel> {
  constructor(
    @InjectModel(InventoryQuantityNormModel.name)
    private readonly inventoryQuantityNorms: Model<InventoryQuantityNormModel>,
  ) {
    super(inventoryQuantityNorms);
  }

  async createOne(
    inventoryQuantityNorms: InventoryQuantityNormsInterface,
  ): Promise<void> {
    const document = new this.inventoryQuantityNorms();
    Object.assign(document, inventoryQuantityNorms);
    await document.save();
  }

  async saveMany(
    inventoryQuantityNorms: InventoryQuantityNormsInterface[],
  ): Promise<any> {
    return this.inventoryQuantityNorms.create(inventoryQuantityNorms);
  }

  async getReportInventoryBelowSafe(request: ReportRequest): Promise<any> {
    const { companyCode, reportType, warehouseCode } = request;

    const currentDate = getTimezone(undefined, FORMAT_DATE);
    const condition = {
      $and: [],
    } as any;

    const conditionQuantity = {
      $and: [],
    };

    switch (reportType) {
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

    if (companyCode) {
      condition['$and'].push({
        companyCode: { $eq: companyCode },
      });
    }

    if (warehouseCode) {
      condition['$and'].push({
        warehouseCode: { $eq: warehouseCode },
      });
    }

    return this.inventoryQuantityNorms.aggregate([
      {
        $match: condition,
      },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          warehouseName: 1,
          warehouseCode: 1,
          minInventoryLimit: 1,
          inventoryLimit: 1,
        },
      },
      {
        $lookup: {
          from: 'daily-warehouse-item-stock',
          let: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
            reportDate: '$reportDate',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        {
                          $dateToString: {
                            date: '$reportDate',
                            format: '%Y-%m-%d',
                          },
                        },
                        moment(currentDate, FORMAT_DATE)
                          .subtract(1, 'day')
                          .format(FORMAT_DATE),
                      ],
                    },
                    {
                      $eq: ['$companyCode', '$$companyCode'],
                    },
                    {
                      $eq: ['$warehouseCode', '$$warehouseCode'],
                    },
                    {
                      $eq: ['$itemCode', '$$itemCode'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                companyCode: 1,
                itemCode: 1,
                warehouseCode: 1,
                stockQuantity: 1,
              },
            },
            {
              $group: {
                _id: {
                  companyCode: '$companyCode',
                  itemCode: '$itemCode',
                  warehouseCode: '$warehouseCode',
                },
                stockQuantity: {
                  $sum: '$stockQuantity',
                },
              },
            },
            {
              $project: {
                _id: 0,
                companyCode: '$_id.companyCode',
                itemCode: '$_id.itemCode',
                warehouseCode: '$_id.warehouseCode',
                stockQuantity: 1,
              },
            },
          ],
          as: 'dailyWarehouseItemStock',
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          warehouseName: 1,
          warehouseCode: 1,
          stockQuantity: {
            $cond: {
              if: '$dailyWarehouseItemStock',
              then: {
                $sum: '$dailyWarehouseItemStock.stockQuantity',
              },
              else: 0,
            },
          },
          minInventoryLimit: 1,
          inventoryLimit: 1,
        },
      },
      {
        $lookup: {
          from: 'transaction-item',
          let: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
            transactionDate: '$transactionDate',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        {
                          $dateToString: {
                            date: '$transactionDate',
                            format: '%Y-%m-%d',
                          },
                        },
                        currentDate,
                      ],
                    },
                    {
                      $eq: ['$companyCode', '$$companyCode'],
                    },
                    {
                      $eq: ['$warehouseCode', '$$warehouseCode'],
                    },
                    {
                      $eq: ['$itemCode', '$$itemCode'],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: {
                  companyCode: '$companyCode',
                  itemCode: '$itemCode',
                  warehouseCode: '$warehouseCode',
                },
                stockQuantity: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ['$actionType', 0],
                      },
                      '$actualQuantity',
                      {
                        $multiply: ['$actualQuantity', -1],
                      },
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                companyCode: '$_id.companyCode',
                itemCode: '$_id.itemCode',
                warehouseCode: '$_id.warehouseCode',
                stockQuantity: 1,
              },
            },
          ],
          as: 'transactionItem',
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: 1,
          itemCode: 1,
          itemName: 1,
          unit: 1,
          warehouseName: 1,
          warehouseCode: 1,
          minInventoryLimit: 1,
          inventoryLimit: 1,
          stockQuantity: {
            $add: [
              '$stockQuantity',
              {
                $sum: '$transactionItem.stockQuantity',
              },
            ],
          },
        },
      },
      {
        $match: conditionQuantity,
      },
    ]);
  }

  async getReportReOderQuantity(request: ReportRequest): Promise<any> {
    const { companyCode, warehouseCode } = request;
    const condition = {
      $and: [],
    } as any;
    if (companyCode) {
      condition['$and'].push({
        companyCode: { $eq: companyCode },
      });
    }

    if (warehouseCode) {
      condition['$and'].push({
        warehouseCode: { $eq: warehouseCode },
      });
    }

    return this.inventoryQuantityNorms.aggregate([
      {
        $match: condition,
      },
      {
        $group: {
          _id: {
            companyCode: '$companyCode',
            warehouseCode: '$warehouseCode',
            itemCode: '$itemCode',
          },
          eoq: { $sum: '$eoq' },
          reorderPoint: { $sum: '$reorderPoint' },
        },
      },
      {
        $project: {
          _id: 0,
          companyCode: '$_id.companyCode',
          itemCode: '$_id.itemCode',
          warehouseCode: '$_id.warehouseCode',
          eoq: 1,
          reorderPoint: 1,
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
    ]);
  }
}
