import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type OrderItemLotDocument = ReportOrderItemLot & Document;

@Schema({ collection: 'report-order-item-lot', timestamps: true })
export class ReportOrderItemLot {
  @Prop({ required: false })
  orderId: number;

  @Prop({ required: false })
  orderName: string;

  @Prop({ required: false })
  orderCreatedAt: Date;

  @Prop({ required: false })
  itemId: number;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  warehouseId: number;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  warehouseName: string;

  @Prop({ required: false })
  lotNumber: string;

  @Prop({ required: false, default: 0 })
  planQuantity: number;

  @Prop({ required: false, default: 0 })
  actualQuantity: number;

  @Prop({ required: false, default: 0 })
  receivedQuantity: number;

  @Prop({ required: false, default: 0 })
  storedQuantity: number;

  @Prop({ required: false, default: 0 })
  collectedQuantity: number;

  @Prop({ required: false, default: 0 })
  exportedQuantity: number;

  @Prop({ required: false, default: 0 })
  cost: number;

  @Prop({ required: false })
  orderType: OrderType;

  @Prop({ required: false })
  actionType: number;

  @Prop({ required: false })
  planDate: Date;

  @Prop({ required: false })
  status: OrderStatus;

  @Prop({ required: false })
  completedAt: Date;

  @Prop({ required: false })
  companyId: number;

  @Prop({ required: false })
  ebsId: Date;

  @Prop({ required: false })
  constructionId: number;

  @Prop({ required: false })
  constructionCode: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  constructionName: string;

  @Prop({ required: false })
  performerId: number;

  @Prop({ required: false })
  performerName: string;

  @Prop({ required: false })
  reason: string;

  @Prop({ required: false })
  explain: string;

  @Prop({ required: false })
  note: string;

  @Prop({ required: false })
  locationName: string;

  @Prop({ required: false })
  locationId: number;

  @Prop({ required: false })
  locationCode: string;

  @Prop({ required: false })
  qrCode: string;

  @Prop({ required: false })
  companyName: string;

  @Prop({ required: false })
  companyAddress: string;

  @Prop({ required: false })
  warehouseTargetId: number;

  @Prop({ required: false })
  warehouseTargetCode: string;

  @Prop({ required: false })
  warehouseTargetName: string;

  @Prop({ required: false })
  purpose: string;

  @Prop({ required: false })
  postCode: string; // chứng từ code

  @Prop({ required: false })
  contract: string;

  @Prop({ required: false })
  providerId: string;

  @Prop({ required: false })
  providerCode: string;

  @Prop({ required: false })
  providerName: string;

  @Prop({ required: false })
  receiveDepartmentId: string;

  @Prop({ required: false })
  receiveDepartmentCode: string;

  @Prop({ required: false })
  receiveDepartmentName: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  accountId: string;

  @Prop({ required: false })
  accountCode: string;

  @Prop({ required: false })
  accountName: string;

  @Prop({ required: false })
  account: string;

  @Prop({ required: false })
  accountDebt: number;

  @Prop({ required: false })
  accountHave: number;

  @Prop({ required: false })
  proposalExport: string; //Giấy đề nghị xuất VT

  @Prop({ required: false })
  orderCode: string;
}

export const ReportOrderItemLotSchema =
  SchemaFactory.createForClass(ReportOrderItemLot);
