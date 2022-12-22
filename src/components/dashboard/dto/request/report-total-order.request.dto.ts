import { BaseDto } from '@core/dto/base.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class ReportTotalOrderRequestDto extends BaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to: Date;
}
