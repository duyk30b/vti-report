import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportOrderInteface } from '@schemas/interface/report-order.interface';
import { ReportOrder } from '@schemas/report-order.schema';
import { plus } from '@utils/common';
import { Model } from 'mongoose';

@Injectable()
export class ReportOrderRepository extends BaseAbstractRepository<ReportOrder> {
  constructor(
    @InjectModel(ReportOrder.name)
    private readonly reportOrder: Model<ReportOrder>,
  ) {
    super(reportOrder);
  }

  async save(data: ReportOrderInteface): Promise<void> {
    const document = new this.reportOrder();
    Object.assign(document, data);
    await document.save();
  }
  saveMany(data: ReportOrderInteface[]) {
    return this.reportOrder.create(data);
  }

  async findOneBycompanyCode(code: string): Promise<ReportOrder> {
    return this.findOneByCondition({ companyCode: code });
  }
}
