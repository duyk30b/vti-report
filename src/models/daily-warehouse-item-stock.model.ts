import { BaseModel } from '@core/model/base.model';
import { Types } from 'mongoose';
export interface DailyWarehouseItemStockModel extends BaseModel {
  itemId: Types.ObjectId;
  stockQuantity: number;
  warehouseId: Types.ObjectId;
  reportDate: string;
  minInventoryLimit: number;
  inventoryLimit: number;
  storageCost: number;
  companyId: Types.ObjectId;
}
