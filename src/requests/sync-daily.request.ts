import { BaseDto } from '@core/dto/base.dto';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class DailyLotLocatorStockRequest {
  dailyWarehouseItemStockId: Types.ObjectId;

  dailyItemLocatorStockId: Types.ObjectId;

  lotNumber: string;

  stockQuantity: number;

  storageDate: string;

  storageCost: number;

  orderId: number;
}

export class DailyItemLocatorStockRequest {
  locatorId: number;

  locatorName: string;

  locatorCode: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyLotLocatorStockRequest)
  dailyLotLocatorStocks: DailyLotLocatorStockRequest[];
}
export class DailyWarehouseItemRequest {
  itemId: number;

  itemName: string;

  itemCode: string;

  warehouseId: number;

  warehouseName: string;

  warehouseCode: string;

  reportDate: Date;

  minInventoryLimit: number;

  inventoryLimit: number;

  companyId: number;

  companyName: string;

  companyAddress: string;

  contructionId: number;

  contructionName: string;

  origin: string;

  note: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyItemLocatorStockRequest)
  dailyItemLocatorStocks: DailyItemLocatorStockRequest[];
}

export class ReportOrderItemLotRequest {
  lotNumber: string;

  planQuantity: number;

  actualQuantity: number;

  receivedQuantity: number;

  storedQuantity: number;

  collectedQuantity: number;

  exportedQuantity: number;

  cost: number;

  reason: string;

  explain: string;

  note: string;

  locationId: number;

  locationCode: string;

  locationName: string;
}

export class ReportOrderItemRequest {
  itemId: number;

  itemName: string;

  itemCode: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReportOrderItemLotRequest)
  reportOrderItemLots: ReportOrderItemLotRequest[];
}

export class ReportOrderRequest {
  orderId: number;

  orderName: string;

  orderCreatedAt: Date;

  warehouseId: number;

  warehouseName: string;

  warehouseCode: string;

  orderType: number;

  actionType: number;

  planDate: Date;

  status: number;

  completedAt: Date;

  companyId: number;

  ebsId: Date;

  constructionId: number;

  constructionCode: string;

  constructionName: string;

  unit: string;

  performerId: number;

  performerName: string;

  qrCode: string;

  companyName: string;

  companyAddress: string;

  warehouseTargetId: number;

  warehouseTargetCode: string;

  warehouseTargetName: string;

  purpose: string;

  postCode: string;

  contract: string;

  description: string;

  accountId: string;

  accountCode: string;

  accountName: string;

  account: string;

  accountDebt: number;

  accountHave: number;

  providerId: string;

  providerCode: string;

  providerName: string;

  receiveDepartmentId: string;

  receiveDepartmentCode: string;

  receiveDepartmentName: string;

  proposalExport: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReportOrderItemRequest)
  reportOrderItems: ReportOrderItemRequest[];
}
export class SyncDailyRequest extends BaseDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyWarehouseItemRequest)
  dailyWarehouseItems: DailyWarehouseItemRequest[];

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReportOrderRequest)
  reportOrders: ReportOrderRequest[];
}
