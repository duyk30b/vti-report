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
      document.orderId = reportOrderRequest?.orderId;
      document.orderName = reportOrderRequest?.orderName;
      document.orderCreatedAt = reportOrderRequest.orderCreatedAt;
      document.warehouseId = reportOrderRequest.warehouseId;
      document.warehouseName = reportOrderRequest.warehouseName;
      document.warehouseCode = reportOrderRequest.warehouseCode;
      document.orderType = reportOrderRequest.orderType;
      document.actionType = reportOrderRequest.actionType;
      document.planDate = reportOrderRequest.planDate;
      document.status = reportOrderRequest.status;
      document.completedAt = reportOrderRequest.completedAt;
      document.companyId = reportOrderRequest.companyId;
      document.ebsId = reportOrderRequest.ebsId;
      document.constructionId = reportOrderRequest.constructionId;
      document.constructionCode = reportOrderRequest.constructionCode;
      document.constructionName = reportOrderRequest.constructionName;
      document.unit = reportOrderRequest.unit;
      document.performerId = reportOrderRequest.performerId;
      document.performerName = reportOrderRequest.performerName;
      document.qrCode = reportOrderRequest.qrCode;
      document.companyName = reportOrderRequest.companyName;
      document.companyAddress = reportOrderRequest.companyAddress;
      document.warehouseTargetId = reportOrderRequest.warehouseTargetId;
      document.warehouseTargetCode = reportOrderRequest.warehouseTargetCode;
      document.warehouseTargetName = reportOrderRequest.warehouseTargetName;
      document.cost = this.sumWarehouse(reportOrderRequest, 'cost');
      document.purpose = reportOrderRequest.purpose;
      document.postCode = reportOrderRequest.postCode;
      document.contract = reportOrderRequest.contract;
      document.providerId = reportOrderRequest.providerId;
      document.receiveDepartmentId = reportOrderRequest.receiveDepartmentId;
      document.providerCode = reportOrderRequest.providerCode;
      document.receiveDepartmentCode = reportOrderRequest.receiveDepartmentCode;
      document.providerName = reportOrderRequest.providerName;
      document.receiveDepartmentName = reportOrderRequest.receiveDepartmentName;
      document.description = reportOrderRequest.description;
      document.accountId = reportOrderRequest.accountId;
      document.accountCode = reportOrderRequest.accountCode;
      document.accountName = reportOrderRequest.accountName;
      document.account = reportOrderRequest.account;
      document.accountDebt = reportOrderRequest.accountDebt;
      document.accountHave = reportOrderRequest.accountHave;
      document.proposalExport = reportOrderRequest.proposalExport;

      document.planQuantity = this.sumWarehouse(
        reportOrderRequest,
        'planQuantity',
      );
      document.actualQuantity = this.sumWarehouse(
        reportOrderRequest,
        'actualQuantity',
      );
      document.receivedQuantity = this.sumWarehouse(
        reportOrderRequest,
        'receivedQuantity',
      );
      document.storedQuantity = this.sumWarehouse(
        reportOrderRequest,
        'storedQuantity',
      );
      document.collectedQuantity = this.sumWarehouse(
        reportOrderRequest,
        'collectedQuantity',
      );
      document.exportedQuantity = this.sumWarehouse(
        reportOrderRequest,
        'exportedQuantity',
      );

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
