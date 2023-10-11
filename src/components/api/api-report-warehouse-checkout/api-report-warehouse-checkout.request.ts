import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsDate, IsDefined, IsPositive, IsString } from 'class-validator'

export class ApiReportWarehouseCheckoutQuery {
	@ApiProperty({ example: '2023-09-17T17:00:00.000Z' })
	@Expose()
	@Type(() => Date)
	@IsDefined()
	@IsDate()
	fromTime: Date

	@ApiProperty({ example: '2023-09-20T17:00:00.000Z' })
	@Expose()
	@Type(() => Date)
	@IsDefined()
	@IsDate()
	toTime: Date

	@ApiProperty({ example: 'XXX222GG' })
	@IsString()
	ticketCode: string

	@ApiPropertyOptional({ example: 42 })
	@Type(() => Number)
	@IsPositive()
	warehouseId: number
}
