import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsDate, IsDefined, IsIn, IsPositive, IsString } from 'class-validator'
import { ExportFileType } from 'src/components/constants/variable'

export class ApiItemStockDailyQuery {
  @ApiProperty({ example: '2023-09-17T17:00:00.000Z' })
  @Expose()
  @Type(() => Date)
  @IsDefined()
  @IsDate()
  time: Date

  @ApiPropertyOptional({ example: 42 })
  @Type(() => Number)
  @IsPositive()
  warehouseId: number

  @ApiPropertyOptional({ example: 'AVC' })
  @IsString()
  itemCode: string

  @ApiPropertyOptional({ example: 'XXX' })
  @IsString()
  itemTypeCode: string

  @ApiPropertyOptional({ example: 'CCC' })
  @IsString()
  costCenterCode: string

  @ApiPropertyOptional({ example: ExportFileType.EXCEL })
  @IsDefined()
  @IsIn([ExportFileType.EXCEL])
  exportFileType: ExportFileType
}
