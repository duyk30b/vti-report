import { Controller, Get } from '@nestjs/common'
import { BullQueueService } from 'src/modules/redis/bull-queue/bull-queue.service'

@Controller()
export class BullProcessorController {
	constructor(private readonly bullQueueService: BullQueueService) {
	}

	@Get('bull/ping')
	async ping() {
		console.log('🚀 ~ file: bull-processor.controller.ts:11 ~ BullProcessorController ~ ping ~ ping:')
		const response = await this.bullQueueService.addDemoJob({
			data: { message: 'ping' },
			messageId: 'ping_' + new Date().toISOString(),
			createTime: new Date().toISOString(),
		})
		return response
	}
}
