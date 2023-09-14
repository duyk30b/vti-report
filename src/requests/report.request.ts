import { BaseDto } from '@core/dto/base.dto';
import { ExportType } from '@enums/export-type.enum';
import { ReportTypeEnum } from '@enums/report-type.enum';
import { getTimezone } from '@utils/common';
import { FORMAT_DATE } from '@utils/constant';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReportRequest extends BaseDto {
  @IsNotEmpty()
  @IsEnum(ReportTypeEnum)
  @Transform(({ value }) => {
    return Number(value);
  })
  reportType: ReportTypeEnum;

  @IsNotEmpty()
  @IsEnum(ExportType)
  @Transform(({ value }) => {
    return Number(value);
  })
  exportType: ExportType;

  @IsNotEmpty()
  @IsString()
  companyCode: string;

  @IsOptional()
  @IsString()
  constructionCode: string;

  @IsOptional()
  @IsString()
  warehouseCode: string;

  @IsOptional()
  @IsString()
  departmentReceiptCode: string;

  @IsOptional()
  @Transform(({ value }) => {
    return getTimezone(value, FORMAT_DATE);
  })
  dateTo: Date;

  @IsOptional()
  @Transform(({ value }) => {
    return getTimezone(value);
  })
  dateFrom: Date;
}
