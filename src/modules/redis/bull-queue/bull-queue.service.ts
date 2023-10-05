import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { IPingQueueMessage, IWarehouseImportMessage } from './bull-queue.interface'
import { QUEUE_EVENT } from './bull-queue.variable'

@Injectable()
export class BullQueueService {
	constructor(
		@InjectQueue(QUEUE_EVENT.PING)
		private readonly pingQueue: Queue,
		@InjectQueue(QUEUE_EVENT.WAREHOUSE_IMPORT_CONFIRM)
		private readonly warehouseImportConfirmQueue: Queue
	) { }

	async addPingJob(data: IPingQueueMessage) {
		await this.pingQueue.add(data)
	}

	async addWarehouseImportJob(data: IWarehouseImportMessage) {
		await this.warehouseImportConfirmQueue.add(data)
	}
}
