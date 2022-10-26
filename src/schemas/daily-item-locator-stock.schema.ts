import { DailyLocatorStockInterface } from '@schemas/interface/daily-locator-stock.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DailyItemLocatorStockDocument = DailyItemLocatorStock & Document;

@Schema({ collection: 'daily-item-locator-stock', timestamps: true })
export class DailyItemLocatorStock implements DailyLocatorStockInterface {
  @Prop({ required: false })
  warehouseId: number;

  @Prop({ required: false })
  locatorId: number;

  @Prop({ required: false })
  locatorName: string;

  @Prop({ required: false })
  locatorCode: string;

  @Prop({ required: false })
  itemId: number;

  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  stockQuantity: number;

  @Prop({ required: false })
  reportDate: Date;

  @Prop({ required: false })
  companyId: number;

  @Prop({ required: false })
  storageCost: number;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  warehouseName: string;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  companyName: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  minInventoryLimit: number;

  @Prop({ required: false })
  inventoryLimit: number;

  @Prop({ required: false })
  companyAddress: string;

  @Prop({ required: false })
  origin: string;

  @Prop({ required: false })
  note: string;
}

export const DailyItemLocatorStockSchema = SchemaFactory.createForClass(
  DailyItemLocatorStock,
);
