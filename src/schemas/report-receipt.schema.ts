import { BaseEntity } from '@core/entity/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReportReceiptInteface } from './interface/report-receipt.interface';

export type ReportReceiptDocument = ReportReceipt & Document;

@Schema({ collection: 'report-receipt', timestamps: true })
export class ReportReceipt extends BaseEntity implements ReportReceiptInteface {
  @Prop({ required: false })
  code: string;

  @Prop({ required: false })
  contractNumber: string;

  @Prop({ required: false, default: null })
  receiptNumber: string;

  @Prop({ required: false, default: 0 })
  status: number;

  @Prop({ required: false })
  companyCode: string;

  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false, default: 0 })
  itemName: string;

  @Prop({ required: false, default: 0 })
  quantity: number;

  @Prop({ required: false })
  orderQuantity: number;

  @Prop({ required: false })
  price: number;

  @Prop({ required: false })
  amount: number;

  @Prop({ required: false })
  receiptDate: Date;
}

export const ReportReceiptSchema = SchemaFactory.createForClass(ReportReceipt);
