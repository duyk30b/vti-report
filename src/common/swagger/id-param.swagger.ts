import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class IdParam {
  @ApiProperty({ name: 'id', example: 2 })
  @Expose({ name: 'id' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id: number
}
