import { Module } from '@nestjs/common'
import { BullQueueModule } from 'src/modules/redis/bull-queue/bull-queue.module'
import { BullProcessorController } from './bull-processor.controller'
import { PingProcessor } from './processor/ping-processor.service'
import { WarehouseImportConfirmProcessor } from './processor/warehouse-import-processor.service'
import { DemoProcessor } from './processor/demo-processor.service'

@Module({
	imports: [BullQueueModule.registerConsumer()],
	controllers: [BullProcessorController],
	providers: [
		PingProcessor,
		DemoProcessor,
		WarehouseImportConfirmProcessor,
	],
})
export class BullProcessorModule { }
