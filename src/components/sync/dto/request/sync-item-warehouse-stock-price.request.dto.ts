import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DataItemWarehousePriceRequestDto {
  @ApiProperty({ example: '0.00.000.00.123.000.000', description: 'Mã vật tư' })
  @IsString()
  itemCode: string;

  @ApiProperty({ example: '0.00.000.00.123.000.000', description: 'Mã vật tư' })
  @IsDate()
  reportDate: Date;

  @ApiProperty({ example: 'ZOT', description: 'Mã kho' })
  @IsString()
  warehouseCode: string;

  @ApiProperty({ example: 'LOT-123', description: 'Số lô' })
  @IsString()
  @IsOptional()
  lotNumber: string;

  @ApiProperty({ example: 1000, description: 'Thành tiền' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 1000, description: 'Thành tiền' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 200, description: 'Đơn giá' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  amount: number;

  companyCode: string;

  @ApiProperty({ example: 'Vietnam', description: 'Xuât xứ' })
  @IsString()
  @IsOptional()
  manufacturingCountry: string;
}

export class SyncItemWarehouseStockPriceRequestDto extends BaseDto {
  @ApiProperty({ example: '030400', description: 'Mã công ty' })
  @IsString()
  companyCode: string;

  @ApiProperty({ description: 'Data giá' })
  @ValidateNested({ each: true })
  @Type(() => DataItemWarehousePriceRequestDto)
  data: DataItemWarehousePriceRequestDto[];
}
