import { BaseEntity } from '@core/entity/base.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InventoryQuantityNormsInterface } from './interface/inventory-quantity-norms';
export type ReportOrderDocument = InventoryQuantityNormModel & Document;

@Schema({ collection: 'inventory-quantity-norms', timestamps: true })
export class InventoryQuantityNormModel
  extends BaseEntity
  implements InventoryQuantityNormsInterface
{
  @Prop({ required: true })
  companyCode: string;

  @Prop({ required: true })
  warehouseCode: string;

  @Prop({ required: true })
  itemCode: string;

  @Prop({ required: false, default: 0 })
  inventoryLimit: number;

  @Prop({ required: false, default: 0 })
  minInventoryLimit: number;
}
export const InventoryQuantityNormSchema = SchemaFactory.createForClass(
  InventoryQuantityNormModel,
);
InventoryQuantityNormSchema.index(
  {
    companyCode: 1,
    warehouseCode: 1,
    itemCode: 1,
  },
  { unique: true },
);
