import { BaseDto } from '@core/dto/base.dto';
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
  @IsNotEmpty()
  @IsString()
  lotNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stockQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  reportDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  storageDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  account: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  storageCost: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minInventoryLimit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  inventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  orderId: number;

  warehouseId: number;
  locatorId: number;
  warehouseCode: string;
  itemId: number;
  locatorCode: string;
  locatorName: string;
  companyId: number;
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
  @IsNotEmpty()
  @IsNumber()
  locatorId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locatorName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locatorCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  reportDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  origin: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minInventoryLimit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  inventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  storageCost: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyLotLocatorStockRequest)
  dailyLotLocatorStocks: DailyLotLocatorStockRequest[];

  warehouseId: number;
  itemId: number;
  itemCode: string;
  companyId: number;
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
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  warehouseName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  warehouseCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  reportDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  minInventoryLimit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  inventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
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
  @IsNumber()
  orderId: number;

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
  @IsNumber()
  warehouseId: number;

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
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  constructionId: number;

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
  @IsDateString()
  ebsId: Date;

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
}
