import { Module } from '@nestjs/common'
import { SnapshotItemMovementController } from './snapshot-item-movement.controller'
import { SnapshotItemMovementService } from './snapshot-item-movement.service'

@Module({
	imports: [],
	controllers: [SnapshotItemMovementController],
	providers: [SnapshotItemMovementService],
})
export class SnapshotMovementModule {}
