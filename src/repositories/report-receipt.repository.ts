import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportRequest } from '@requests/report.request';
import { ReportReceiptInteface } from '@schemas/interface/report-receipt.interface';
import { ReportReceipt } from '@schemas/report-receipt.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReportReceiptRepository extends BaseAbstractRepository<ReportReceiptInteface> {
  constructor(
    @InjectModel(ReportReceipt.name)
    private readonly reportReceipt: Model<ReportReceiptInteface>,
  ) {
    super(reportReceipt);
  }

  async getDataRecept(request: ReportRequest) {
    const { companyCode } = request;
    const condition = {
      $and: [{}],
    };

    if (request?.companyCode)
      condition['$and'].push({
        companyCode: { $eq: companyCode },
      });
    condition['$and'].push({
      status: { $eq: 0 },
    });
    return this.reportReceipt
      .aggregate([
        { $match: condition },
        {
          $group: {
            _id: {
              companyCode: '$companyCode',
              itemCode: '$itemCode',
            },
            orderQuantity: { $sum: '$orderQuantity' },
          },
        },
        {
          $project: {
            _id: 0,
            orderQuantity: 1,
            key: {
              $concat: [
                { $ifNull: ['$_id.companyCode', ''] },
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
