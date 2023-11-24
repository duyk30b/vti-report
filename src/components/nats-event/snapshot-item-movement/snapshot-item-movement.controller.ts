import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { NatsSubject } from 'src/modules/nats/nats.config'
import { SnapshotItemMovementRequest } from './snapshot-item-movement.request'
import { SnapshotItemMovementService } from './snapshot-item-movement.service'

@Controller()
export class SnapshotItemMovementController {
  constructor(private readonly snapshotItemMovementService: SnapshotItemMovementService) {}

  @MessagePattern(NatsSubject.REPORT.SNAPSHOT_ITEM_MOVEMENT, Transport.NATS)
  async createManyItemMovement(@Payload() payload: SnapshotItemMovementRequest) {
    return this.snapshotItemMovementService.createManyItemMovement(payload)
  }
}
