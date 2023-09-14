import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SyncDailyReportStockRequestDto extends BaseDto {
  @ApiProperty()
  @IsString()
  companyCode: string;

  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  warehouseCode: string;

  @ApiProperty()
  @IsString()
  warehouseName: string;

  @ApiProperty()
  @IsString()
  locatorCode: string;

  @ApiProperty()
  @IsString()
  locatorName: string;

  @ApiProperty()
  @IsString()
  lotNumber: string;

  @ApiProperty()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsString()
  itemName: string;

  @ApiProperty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsDateString()
  storageDate: Date;

  @ApiProperty()
  @IsNumber()
  stockQuantity: number;

  @ApiProperty()
  @IsDateString()
  reportDate: Date;

  @ApiProperty()
  @IsDateString()
  productionDate: Date;

  @ApiProperty()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  totalAmount: number;
}

export class SyncDailyReportStockRequestBody {
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  data: SyncDailyReportStockRequestDto[];
}
