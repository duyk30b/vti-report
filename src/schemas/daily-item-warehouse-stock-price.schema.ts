import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DailyItemWarehouseStockPriceInterface } from './interface/daily-item-warehouse-stock-price.interface';

export type DailyItemLocatorStockPriceDocument = DailyItemWarehouseStockPrice &
  Document;

@Schema({ collection: 'daily-item-warehouse-stock-price', timestamps: true })
export class DailyItemWarehouseStockPrice
  implements DailyItemWarehouseStockPriceInterface
{
  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false, default: null })
  lotNumber: string;

  @Prop({ required: false, default: 0 })
  quantity: number;

  @Prop({ required: false, default: 0 })
  price: number;

  @Prop({ required: false, default: 0 })
  amount: number;

  @Prop({ required: false })
  reportDate: Date;

  @Prop({ required: false })
  companyCode: string;
}

export const DailyItemWarehouseStockPriceSchema = SchemaFactory.createForClass(
  DailyItemWarehouseStockPrice,
);
