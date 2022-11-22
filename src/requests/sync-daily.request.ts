import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { DailyLocatorStockInterface } from '@schemas/interface/daily-locator-stock.interface';
import { DailyItemLotLocatorStockInterface } from '@schemas/interface/daily-lot-locator-stock.interface';
import { DailyWarehouseItemStockInterface } from '@schemas/interface/daily-warehouse-item-stock.interface';
import { ReportOrderInteface } from '@schemas/interface/report-order.interface';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReportOrderItemRequest } from './report-order-items.request';

export class DailyLotLocatorStockRequest
  implements DailyItemLotLocatorStockInterface
{
  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  reportDate: Date;

  @ApiProperty()
  @IsOptional()
  storageDate: Date;

  @ApiProperty()
  @IsOptional()
  account: string;

  @ApiProperty()
  @IsOptional()
  storageCost: number;

  @ApiProperty()
  @IsOptional()
  minInventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  inventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsOptional()
  origin: string;

  @ApiProperty()
  @IsOptional()
  note: string;

  warehouseCode: string;
  locatorCode: string;
  locatorName: string;
  companyCode: string;
  itemCode: string;
  itemName: string;
  warehouseName: string;
  companyName: string;
  companyAddress: string;
}

export class DailyItemLocatorStockRequest
  implements DailyLocatorStockInterface
{
  @ApiProperty()
  @IsOptional()
  locatorName: string;

  @ApiProperty()
  @IsOptional()
  locatorCode: string;

  @ApiProperty()
  @IsOptional()
  reportDate: Date;

  @ApiProperty()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsString()
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  minInventoryLimit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  inventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  storageCost: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyLotLocatorStockRequest)
  dailyLotLocatorStocks: DailyLotLocatorStockRequest[];

  itemCode: string;
  companyCode: string;
  itemName: string;
  warehouseName: string;
  warehouseCode: string;
  companyName: string;
  companyAddress: string;
}
export class DailyWarehouseItemRequest
  implements DailyWarehouseItemStockInterface
{
  @ApiProperty()
  @IsOptional()
  itemName: string;

  @ApiProperty()
  @IsOptional()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  warehouseName: string;

  @ApiProperty()
  @IsOptional()
  warehouseCode: string;

  @ApiProperty()
  @IsOptional()
  companyCode: string;

  @ApiProperty()
  @IsOptional()
  companyName: string;

  @ApiProperty()
  @IsOptional()
  companyAddress: string;

  @ApiProperty()
  @IsOptional()
  reportDate: Date;

  @ApiProperty()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsOptional()
  origin: string;

  @ApiProperty()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  minInventoryLimit: number;

  @ApiProperty()
  @IsNotEmpty()
  inventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  storageCost: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyItemLocatorStockRequest)
  dailyItemLocatorStocks: DailyItemLocatorStockRequest[];
}

export class ReportOrderRequest implements ReportOrderInteface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  orderCreatedAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  warehouseCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  warehouseName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  planDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  completedAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  companyAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  constructionCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  constructionName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ebsNumber: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReportOrderItemRequest)
  reportOrderItems: ReportOrderItemRequest[];
}
export class SyncDailyStockRequest extends BaseDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyWarehouseItemRequest)
  dailyWarehouseItems: DailyWarehouseItemRequest[];
}

export class SyncDailyReportRequest extends BaseDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReportOrderRequest)
  reportOrders: ReportOrderRequest[];

  @IsNotEmpty()
  @IsEnum(ActionType)
  actionype: ActionType;
}
