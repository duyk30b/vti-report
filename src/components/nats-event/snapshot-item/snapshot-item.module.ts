import { Module } from '@nestjs/common'
import { SnapshotItemController } from './snapshot-item.controller'
import { SnapshotItemService } from './snapshot-item.service'

@Module({
  imports: [],
  controllers: [SnapshotItemController],
  providers: [SnapshotItemService],
})
export class SnapshotItemModule {}
