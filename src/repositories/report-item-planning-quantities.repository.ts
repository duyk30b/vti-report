import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportItemPlanningQuantities } from '@schemas/report-item-planning-quantitie.schema';
import { Model } from 'mongoose';
import { ReportRequest } from '@requests/report.request';

@Injectable()
export class ReportItemPlanningQuantitesRepository extends BaseAbstractRepository<ReportItemPlanningQuantities> {
  constructor(
    @InjectModel(ReportItemPlanningQuantities.name)
    private readonly reportItemPlanningQuantities: Model<ReportItemPlanningQuantities>,
  ) {
    super(reportItemPlanningQuantities);
  }

  async getReportItemPlanning(request: ReportRequest): Promise<any> {
    const condition = {
      $and: [{}],
    };

    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: request?.companyCode },
      });
    if (request?.warehouseCode)
      condition['$and'].push({
        warehouseCode: { $eq: request?.warehouseCode },
      });

    return this.reportItemPlanningQuantities
      .aggregate([
        { $match: condition },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              companyCode: '$companyCode',
              warehouseCode: '$warehouseCode',
              itemCode: '$itemCode',
            },
            itemName: { $first: '$itemName' },
            itemUnit: { $first: '$itemUnit' },
            planQuantity: { $sum: '$planQuantity' },
            quantity: { $sum: '$quantity' },
          },
        },
        {
          $project: {
            _id: 0,
            companyCode: '$_id.companyCode',
            warehouseCode: '$_id.warehouseCode',
            itemCode: '$_id.itemCode',
            itemName: 1,
            itemunit: 1,
            planQuantity: 1,
            quantity: 1,
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
      ])
      .exec();
  }
}
