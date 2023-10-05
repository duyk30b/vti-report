import { Controller, Get } from '@nestjs/common'
import { BullQueueService } from 'src/modules/redis/bull-queue/bull-queue.service'

@Controller()
export class BullProcessorController {
	constructor(private readonly bullQueueService: BullQueueService) {
	}

	@Get('bull/ping')
	async ping() {
		const response = await this.bullQueueService.addPingJob({
			data: { message: 'ping' },
			messageId: 'ping_' + new Date().toISOString(),
			createTime: new Date().toISOString(),
		})
		return response
	}
}
