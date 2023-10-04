import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class BaseQuery {
	// @ApiPropertyOptional({ name: 'lang', example: 'vi' })
	// @Expose({ name: 'lang' })
	// @IsString()
	// lang: string
}
