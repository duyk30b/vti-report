import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReportOrderItemLotInteface } from './interface/report-order-item-lot.interface';

export type OrderItemLotDocument = ReportOrderItemLot & Document;

@Schema({ collection: 'report-order-item-lot', timestamps: true })
export class ReportOrderItemLot implements ReportOrderItemLotInteface {
  @Prop({ required: false })
  departmentReceiptCode: string;

  @Prop({ required: false })
  departmentReceiptName: string;

  @Prop({ required: false })
  ebsNumber: string;

  @Prop({ required: false })
  orderCreatedAt: Date;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  itemCode: string;

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
  storageCost: number;

  @Prop({ required: false })
  orderType: OrderType;

  @Prop({ required: false })
  planDate: Date;

  @Prop({ required: false })
  status: OrderStatus;

  @Prop({ required: false })
  completedAt: Date;

  @Prop({ required: false })
  companyCode: string;

  @Prop({ required: false })
  constructionCode: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  constructionName: string;

  @Prop({ required: false })
  performerName: string;

  @Prop({ required: false })
  reason: string;

  @Prop({ required: false })
  explain: string;

  @Prop({ required: false })
  note: string;

  @Prop({ required: false })
  locatorName: string;

  @Prop({ required: false })
  locatorCode: string;

  @Prop({ required: false })
  qrCode: string;

  @Prop({ required: false })
  companyName: string;

  @Prop({ required: false })
  companyAddress: string;

  @Prop({ required: false })
  warehouseTargetCode: string;

  @Prop({ required: false })
  warehouseTargetName: string;

  @Prop({ required: false })
  contract: string;

  @Prop({ required: false })
  providerCode: string;

  @Prop({ required: false })
  providerName: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  account: string;

  @Prop({ required: false })
  accountDebt: string;

  @Prop({ required: false })
  accountHave: string;

  @Prop({ required: false })
  warehouseExportProposals: string; //Giấy đề nghị xuất VT

  @Prop({ required: false })
  orderCode: string;
}

export const ReportOrderItemLotSchema =
  SchemaFactory.createForClass(ReportOrderItemLot);
