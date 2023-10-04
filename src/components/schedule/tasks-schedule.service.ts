import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SyncWarehouseImportService } from './jobs/sync-warehouse-import.service'

@Injectable()
export class TasksScheduleService {
	private readonly logger = new Logger(TasksScheduleService.name)

	constructor(private readonly syncWarehouseImportService: SyncWarehouseImportService) {
		// this.seedData()
	}

	// async seedData() {
	// 	const time = new Date('2023-08-10T19:26:09.973Z')
	// 	for (let i = 0; i < 60; i++) {
	// 		time.setDate(time.getDate() + 1)
	// 		await this.syncWarehouseImportService.startSyncTime(time.getTime())
	// 	}
	// }

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
	async startSyncToday() {
		const now = new Date()
		await this.syncWarehouseImportService.startSyncTime(now.getTime())
	}

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
	// async reportInventory() {
	// 	// const data = this.natsClientTicketService.getInventory({ example: 'time_today' })
	// }

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
	// async reportStockMovement() {
	// 	// const data = this.natsClientTicketService.getStockMovement({ example: 'time_today' })
	// }

	// @Cron(CronExpression.EVERY_5_SECONDS, { timeZone: 'Asia/Ho_Chi_Minh' })
	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
	// async syncWarehouseExportToday() {
	// 	const data = this.natsClientTicketService.getWarehouseExportList({ example: 'time_today' })
	// }

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
	// async syncWarehouseTransferToday() {
	// 	const data = this.natsClientTicketService.getWarehouseTransferList({ example: 'time_today' })
	// }

	// @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Ho_Chi_Minh' })
	// async syncWarehouseCheckoutToday() {
	// 	const data = this.natsClientTicketService.getWarehouseCheckoutList({ example: 'time_today' })
	// }
}