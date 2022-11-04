import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportOrderRequest } from '@requests/sync-daily.request';
import { ReportOrderInteface } from '@schemas/interface/report-order.interface';
import { ReportOrder } from '@schemas/report-order.schema';
import { plus } from '@utils/common';
import { ClientSession } from 'mongoose';
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

  async findOneByCompanyId(id: number): Promise<ReportOrder> {
    return this.findOneByCondition({ companyId: id });
  }

  private sumWarehouse(
    reportOrderRequest: ReportOrderRequest,
    field: string,
  ): number {
    let quantity = 0;
    reportOrderRequest?.reportOrderItems.forEach((reportOrderItem) => {
      reportOrderItem?.reportOrderItemLots.forEach((reportOrderItemLot) => {
        quantity = plus(quantity || 0, reportOrderItemLot[field] || 0);
      });
    });
    return quantity;
  }
}
