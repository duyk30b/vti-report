import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DailyItemLotLocatorStockInterface } from './interface/daily-lot-locator-stock.interface';
export type DailyLotLocatorStockDocument = DailyLotLocatorStock & Document;

@Schema({ collection: 'daily-lot-locator-stock', timestamps: true })
export class DailyLotLocatorStock implements DailyItemLotLocatorStockInterface {
  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  lotNumber: string;

  @Prop({ required: false, default: 0 })
  stockQuantity: number;

  @Prop({ required: false })
  reportDate: Date;

  @Prop({ required: false })
  locatorCode: string;

  @Prop({ required: false })
  locatorName: string;

  @Prop({ required: false })
  storageDate: Date;

  @Prop({ required: false })
  account: string;

  @Prop({ required: false })
  companyCode: string;

  //add
  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  warehouseName: string;

  @Prop({ required: false, default: 0 })
  minInventoryLimit: number;

  @Prop({ required: false, default: 0 })
  inventoryLimit: number;

  @Prop({ required: false })
  companyName: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  companyAddress: string;

  @Prop({ required: false })
  origin: string;

  @Prop({ required: false, default: 0 })
  storageCost: number;

  @Prop({ required: false })
  note: string;
}

export const DailyLotLocatorStockSchema =
  SchemaFactory.createForClass(DailyLotLocatorStock);
