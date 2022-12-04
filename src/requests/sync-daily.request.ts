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
  IsEnum,
  IsNotEmpty,
  IsOptional,
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
  @IsOptional()
  origin: string;

  @ApiProperty()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsOptional()
  minInventoryLimit: number;

  @ApiProperty()
  @IsOptional()
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
  @IsNotEmpty()
  syncCode: string;

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
  @IsOptional()
  minInventoryLimit: number;

  @ApiProperty()
  @IsOptional()
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

export class SyncDailyStockRequest extends BaseDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => DailyWarehouseItemRequest)
  dailyWarehouseItems: DailyWarehouseItemRequest[];
}
