import { Module } from '@nestjs/common'
import { BullQueueModule } from 'src/modules/redis/bull-queue/bull-queue.module'
import { BullProcessorController } from './bull-processor.controller'
import { DemoProcessor } from './processor/ping-processor.service'
import { WarehouseImportConfirmProcessor } from './processor/warehouse-import-processor.service'

@Module({
	imports: [BullQueueModule.registerConsumer()],
	controllers: [BullProcessorController],
	providers: [DemoProcessor, WarehouseImportConfirmProcessor],
})
export class BullProcessorModule { }
