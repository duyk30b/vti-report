import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsDate, IsDefined, IsPositive } from 'class-validator'

export class ApiReportItemQuery {
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
}
