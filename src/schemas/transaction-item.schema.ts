import { BaseEntity } from '@core/entity/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type TransactionItemDocument = TransactionItem & Document;
@Schema({ collection: 'transaction-item', timestamps: true })
export class TransactionItem extends BaseEntity {
  @Prop({ required: false })
  itemId: number;

  @Prop({ required: false })
  lotNumber: string;

  @Prop({ required: false })
  stockQuantity: number;

  @Prop({ required: false })
  warehouseId: number;

  @Prop({ required: false })
  locatorId: number;

  @Prop({ required: false })
  planQuantity: number;

  @Prop({ required: false })
  storageDate: Date;

  @Prop({ required: false })
  orderId: number;

  @Prop({ required: false })
  orderType: number;
}

export const TransactionItemSchema =
  SchemaFactory.createForClass(TransactionItem);
