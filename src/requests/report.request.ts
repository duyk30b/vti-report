import { BaseDto } from '@core/dto/base.dto';
import { ExportType } from '@enums/export-type.enum';
import { ReportType } from '@enums/report-type.enum';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReportRequest extends BaseDto {
  @IsNotEmpty()
  @IsEnum(ReportType)
  @Transform(({ value }) => {
    return Number(value);
  })
  reportType: ReportType;

  @IsNotEmpty()
  @IsEnum(ExportType)
  @Transform(({ value }) => {
    return Number(value);
  })
  exportType: ExportType;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  companyId: number;

  @IsOptional()
  @IsString()
  constructionId: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  warehouseId: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  receiveDepartmentId: number;

  @IsOptional()
  dateTo: Date;

  @IsOptional()
  dateFrom: Date;
}
