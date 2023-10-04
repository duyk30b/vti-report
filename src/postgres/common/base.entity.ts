import { Expose } from 'class-transformer'
import { PrimaryGeneratedColumn } from 'typeorm'

export class BaseEntity {
	@PrimaryGeneratedColumn({ name: 'id' })
	@Expose({ name: 'id' })
	id: number
}
