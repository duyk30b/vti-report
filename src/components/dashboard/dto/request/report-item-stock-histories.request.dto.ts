import { ReportType } from '@components/dashboard/dashboard.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportTotalOrderRequestDto } from './report-total-order.request.dto';

export class ReportItemStockHistoriesRequestDto extends ReportTotalOrderRequestDto {
  @ApiProperty()
  @IsEnum(ReportType)
  @Transform((data) => Number(data.value))
  reportType: ReportType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  itemCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  warehouseCode: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyCode: string;
}
