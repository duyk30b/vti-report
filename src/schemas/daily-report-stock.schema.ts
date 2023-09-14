import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DailyReportStockInterface } from './interface/daily-report-stock.interface';
export type DailyReportStockDocument = DailyReportStock & Document;

@Schema({ collection: 'daily-report-stocks', timestamps: true })
export class DailyReportStock implements DailyReportStockInterface {
  @Prop({ required: false })
  companyCode: string;

  @Prop({ required: false })
  companyName: string;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  warehouseName: string;

  @Prop({ required: false })
  locatorCode: string;

  @Prop({ required: false })
  locatorName: string;

  @Prop({ required: false })
  lotNumber: string;

  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  unit: string;

  @Prop({ required: false })
  storageDate: Date;

  @Prop({ required: false })
  stockQuantity: number;

  @Prop({ required: false })
  reportDate: Date;

  @Prop({ required: false })
  productionDate: Date;

  @Prop({ required: false })
  status: number;

  @Prop({ required: false })
  price: number;

  @Prop({ required: false })
  totalAmount: number;

  @Prop({ required: false })
  createdAt: Date;
}

export const DailyReportStockSchema =
  SchemaFactory.createForClass(DailyReportStock);
