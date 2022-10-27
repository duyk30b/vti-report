import { BaseEntity } from '@core/entity/base.entity';
import { OrderType } from '@enums/order-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TransactionItemInterface } from './interface/TransactionItem.Interface';
export type TransactionItemDocument = TransactionItem & Document;
@Schema({ collection: 'transaction-item', timestamps: true })
export class TransactionItem
  extends BaseEntity
  implements TransactionItemInterface
{
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
  orderType: OrderType;
}

export const TransactionItemSchema =
  SchemaFactory.createForClass(TransactionItem);
