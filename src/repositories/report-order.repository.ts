import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReportOrderRequest } from '@requests/sync-daily.request';
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

  async createMany(reportOrderRequests: ReportOrderRequest[]): Promise<void> {
    for (const reportOrderRequest of reportOrderRequests) {
      const document = new this.reportOrder();
      Object.assign(document, reportOrderRequest);
      await document.save();
    }
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
