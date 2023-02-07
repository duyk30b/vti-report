import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';


export class LotItems {
  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;
}

export class InventoryQuantityNorms {
  @ApiProperty()
  @IsOptional()
  warehouseCode: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  warehouseName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  itemUnit: string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  inventoryLimit: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  minInventoryLimit: number;
}

export class InventoryQuantityNormsRequest extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InventoryQuantityNorms)
  data: InventoryQuantityNorms[];
}
