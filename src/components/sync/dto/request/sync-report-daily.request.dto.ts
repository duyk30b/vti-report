import { BaseDto } from "@core/dto/base.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SyncReportDailyRequestDto extends BaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message: string;
}