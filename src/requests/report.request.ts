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
    const curDate = new Date(value);
    const curHours = curDate.getHours();
    curDate.setHours(curHours + 7);
    return curDate;
  })
  dateTo: Date;

  @IsOptional()
  @Transform(({ value }) => {
    const curDate = new Date(value);
    const curHours = curDate.getHours();
    curDate.setHours(curHours + 7);
    return curDate;
  })
  dateFrom: Date;
}
