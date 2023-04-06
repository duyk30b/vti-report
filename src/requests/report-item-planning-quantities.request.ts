import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ActionType } from '@enums/export-type.enum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class SyncItemPlanningQuantitiesRequest {
  @ApiProperty()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsNotEmpty()
  itemUnit: string;

  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  warehouseCode: string;

  @ApiProperty()
  @IsOptional()
  locatorCode: string;

  @ApiProperty()
  @IsOptional()
  orderCode: string;

  @ApiProperty()
  @IsNotEmpty()
  orderType: number;

  @ApiProperty()
  @IsNotEmpty()
  planQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  companyCode: string;
}

export class ItemPlanningQuantitesRequest extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  data: SyncItemPlanningQuantitiesRequest[];
}
