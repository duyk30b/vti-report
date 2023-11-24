import { Injectable } from '@nestjs/common'
import { SnapshotItemMovementRequest } from './snapshot-item-movement.request'
import { ItemMovementRepository } from 'src/mongo/repository/item-movement/item-movement.repository'

@Injectable()
export class SnapshotItemMovementService {
	constructor(private readonly itemMovementRepository: ItemMovementRepository) {}

	async createManyItemMovement({ data }: SnapshotItemMovementRequest) {
		await this.itemMovementRepository.insertManyFullField(data)
	}
}
