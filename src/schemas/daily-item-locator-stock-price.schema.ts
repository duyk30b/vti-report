import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DailyItemLocatorStockPriceInterface } from './interface/daily-item-locator-stock-price.interface';

export type DailyItemLocatorStockPriceDocument = DailyItemLocatorStockPrice & Document;

@Schema({ collection: 'daily-item-locator-stock-price', timestamps: true })
export class DailyItemLocatorStockPrice implements DailyItemLocatorStockPriceInterface {
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

export const DailyItemLocatorStockPriceSchema = SchemaFactory.createForClass(
  DailyItemLocatorStockPrice,
);