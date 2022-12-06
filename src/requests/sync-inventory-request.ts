import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Company } from './sync-purchased-order-import.request';

export class Warehouse {
  code: string;
  name: string;
}

class Lot {
  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  lotNumber: string;
}
class ItemInventory {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsOptional()
  price: string;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  lots: Lot[];
}
export class Inventory {
  @ApiProperty()
  @IsOptional()
  orderCreatedAt: Date;

  @ApiProperty()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @Type(() => ItemInventory)
  @ValidateNested({ each: true })
  itemInventory: ItemInventory[];

  @ApiProperty()
  @IsOptional()
  company: Company;

  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsOptional()
  warehouse: Warehouse;
}

export class SyncInventory extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Inventory)
  data: Inventory;
}
