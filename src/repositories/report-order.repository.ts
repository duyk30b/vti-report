import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportOrderInteface } from '@schemas/interface/report-order.interface';
import { ReportOrder } from '@schemas/report-order.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReportOrderRepository extends BaseAbstractRepository<ReportOrder> {
  constructor(
    @InjectModel(ReportOrder.name)
    private readonly reportOrder: Model<ReportOrder>,
  ) {
    super(reportOrder);
  }

  async findOneBycompanyCode(code: string): Promise<ReportOrder> {
    return this.findOneByCondition({ companyCode: code });
  }

  public async bulkWriteOrderReport(
    bulkOps: ReportOrderInteface[],
  ): Promise<any> {
    return await this.model.bulkWrite(
      bulkOps.map((doc) => ({
        updateOne: {
          filter: {
            companyCode: doc.companyCode,
            orderCode: doc.orderCode,
            orderType: doc.orderType,
          },
          update: doc,
          upsert: true,
        },
      })),
    );
  }
}
