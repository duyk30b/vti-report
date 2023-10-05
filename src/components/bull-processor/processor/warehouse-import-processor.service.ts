import { OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { IWarehouseImportMessage } from 'src/modules/redis/bull-queue/bull-queue.interface'
import { BullQueueService } from 'src/modules/redis/bull-queue/bull-queue.service'
import { QUEUE_EVENT } from 'src/modules/redis/bull-queue/bull-queue.variable'

@Processor(QUEUE_EVENT.WAREHOUSE_IMPORT_CONFIRM)
export class WarehouseImportConfirmProcessor {
	private readonly logger = new Logger(WarehouseImportConfirmProcessor.name)

	constructor(private readonly bullQueueService: BullQueueService) { }

	@Process()
	async handleProcess({ data }: Job<IWarehouseImportMessage>) {
		console.log('🚀 ~ WarehouseImportConfirmProcessor ~ handleProcess ~ data:', data)
	}

	@OnQueueFailed()
	async handleFailed(job: Job<IWarehouseImportMessage>, err: Error) {
		const { messageId, data, createTime } = job.data
		this.logger.error(`[${messageId}] handleFailed, error ${err.message}`)
	}
}
