import { BaseModel } from '@core/model/base.model';
import { Types } from 'mongoose';
export interface DailyLotLocaltorStockModel extends BaseModel {
  dailyWarehouseItemStockId: Types.ObjectId;
  dailyItemLocatorStockId: Types.ObjectId;
  warehouseId: Types.ObjectId;
  locatorId: Types.ObjectId;
  itemId: Types.ObjectId;
  lotNumber: string;
  stockQuantity: number;
  reportDate: string;
  locatorName: string;
  locatorCode: string;
  storageDate: string;
  storageCost: number;
  companyId: Types.ObjectId;
  orderId: Types.ObjectId;
}
