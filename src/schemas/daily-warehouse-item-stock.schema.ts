import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DailyWarehouseItemStockInterface } from './interface/daily-warehouse-item-stock.interface';

export type DailyWarehouseItemStockDocument = DailyWarehouseItemStock &
  Document;

@Schema({ collection: 'daily-warehouse-item-stock', timestamps: true })
export class DailyWarehouseItemStock
  implements DailyWarehouseItemStockInterface
{
  @Prop({ required: false })
  itemId: number;

  @Prop({ required: false })
  warehouseId: number;

  @Prop({ required: false })
  reportDate: Date;

  @Prop({ required: false })
  stockQuantity: number;

  @Prop({ required: false })
  minInventoryLimit: number;

  @Prop({ required: false })
  inventoryLimit: number;

  @Prop({ required: false })
  storageCost: number;

  @Prop({ required: false })
  companyId: number;

  @Prop({ required: false })
  companyName: string;

  @Prop({ required: false })
  companyAddress: string;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  warehouseName: string;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  origin: string;

  @Prop({ required: false })
  note: string;
}

export const DailyWarehouseItemStockSchema = SchemaFactory.createForClass(
  DailyWarehouseItemStock,
);
