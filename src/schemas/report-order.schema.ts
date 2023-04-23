import { INVENTORY_ADJUSTMENT_TYPE } from '@constant/common';
import { BaseEntity } from '@core/entity/base.entity';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReportOrderInteface } from './interface/report-order.interface';
export type ReportOrderDocument = ReportOrder & Document;

@Schema({ collection: 'report-order', timestamps: true })
export class ReportOrder extends BaseEntity implements ReportOrderInteface {
  @Prop({ required: false })
  companyCode: string;

  @Prop({ required: false })
  companyName: string;

  @Prop({ required: false })
  companyAddress: string;

  @Prop({ required: false })
  orderCode: string;

  @Prop({ required: false })
  orderCreatedAt: Date;

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
  ebsNumber: string;

  @Prop({ required: false })
  constructionCode: string;

  @Prop({ required: false })
  constructionName: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  transactionNumberCreated: string;
}
export const ReportOrderSchema = SchemaFactory.createForClass(ReportOrder);
