import { INVENTORY_ADJUSTMENT_TYPE } from '@constant/common';
import { BaseEntity } from '@core/entity/base.entity';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReportOrderItemInteface } from './interface/report-order-item.interface';
export type ReportOrderItemDocument = ReportOrderItem & Document;

@Schema({ collection: 'report-order-item', timestamps: true })
export class ReportOrderItem
  extends BaseEntity
  implements ReportOrderItemInteface
{
  @Prop({ required: false })
  receiptNumber: string;

  @Prop({ required: false })
  departmentReceiptCode: string;

  @Prop({ required: false })
  departmentReceiptName: string;

  @Prop({ required: false })
  orderCode: string;

  @Prop({ required: false })
  orderCreatedAt: Date;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  planQuantity: number;

  @Prop({ required: false })
  actualQuantity: number;

  @Prop({ required: false })
  receivedQuantity: number;

  @Prop({ required: false })
  storedQuantity: number;

  @Prop({ required: false })
  collectedQuantity: number;

  @Prop({ required: false })
  exportedQuantity: number;

  @Prop({ required: false })
  storageCost: number;

  @Prop({ required: false })
  amount: number;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  warehouseName: string;

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
  ebsNumber: string;

  @Prop({ required: false })
  constructionCode: string;

  @Prop({ required: false })
  constructionName: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  performerName: string;

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
  reason: string;

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
  warehouseExportProposals: string; // Giay de nghi xuat vat tu

  @Prop({ required: false })
  transactionNumberCreated: string;
}

export const ReportOrderItemSchema =
  SchemaFactory.createForClass(ReportOrderItem);
