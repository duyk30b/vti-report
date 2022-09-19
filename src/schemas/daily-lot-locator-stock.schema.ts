import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export type DailyLotLocatorStockDocument = DailyLotLocatorStock & Document;

@Schema({ collection: 'daily-lot-locator-stock', timestamps: true })
export class DailyLotLocatorStock {
  @Prop({ required: false })
  warehouseId: number;

  @Prop({ required: false })
  locatorId: number;

  @Prop({ required: false })
  dailyWarehouseItemStockId: Types.ObjectId;

  @Prop({ required: false })
  dailyItemLocatorStockId: Types.ObjectId;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  itemId: number;

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

  @Prop({ required: false, default: 0 })
  storageCost: number;

  @Prop({ required: false })
  companyId: number;

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

  @Prop({ required: false })
  status: number;

  @Prop({ required: false, default: 0 })
  cost: number;

  @Prop({ required: false })
  note: string;
}

export const DailyLotLocatorStockSchema =
  SchemaFactory.createForClass(DailyLotLocatorStock);
