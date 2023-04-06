import { BaseEntity } from '@core/entity/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReportItemPlanningQuantitiesInteface } from './interface/report-item-planning-quantities.interface';

export type ReportReceiptDocument = ReportItemPlanningQuantities & Document;

@Schema({ collection: 'item-planning-quantities', timestamps: true })
export class ReportItemPlanningQuantities
  extends BaseEntity
  implements ReportItemPlanningQuantitiesInteface
{
  @Prop({ required: false })
  itemCode: string;

  @Prop({ required: false })
  itemName: string;

  @Prop({ required: false })
  itemUnit: string;

  @Prop({ required: false, default: null })
  lotNumber: string;

  @Prop({ required: false })
  warehouseCode: string;

  @Prop({ required: false })
  locatorCode: string;

  @Prop({ required: false })
  orderCode: string;

  @Prop({ required: false })
  orderType: number;

  @Prop({ required: false, default: 0 })
  planQuantity: number;

  @Prop({ required: false, default: 0 })
  quantity: number;

  @Prop({ required: false })
  companyCode: string;
}

export const ReportItemPlanningQuantitiesSchema = SchemaFactory.createForClass(
  ReportItemPlanningQuantities,
);
