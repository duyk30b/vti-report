import { BaseModel } from '@core/model/base.model';
import { Types } from 'mongoose';
export interface DailyItemLocaltorStockModel extends BaseModel {
  dailyWarehouseItemStockId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  locatorId: Types.ObjectId;
  itemId: Types.ObjectId;
  stockQuantity: number;
  reportDate: string;
  locatorName: string;
  locatorCode: string;
  storageCost: number;
  companyId: Types.ObjectId;
}
