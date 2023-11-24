import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SyncItemService } from './jobs/sync-item.service'
import { SyncWarehouseImportService } from './jobs/sync-warehouse-import.service'
import { DTimer } from 'src/common/utils/time.helper'

@Injectable()
export class TasksScheduleService {
  private readonly logger = new Logger(TasksScheduleService.name)

  constructor(private readonly syncItemService: SyncItemService) {
    // this.seedData()
  }

  // async seedData() {
  // 	const time = new Date('2023-08-10T19:26:09.973Z')
  // 	for (let i = 0; i < 60; i++) {
  // 		time.setDate(time.getDate() + 1)
  // 		await this.syncWarehouseImportService.startSyncTime(time.getTime())
  // 	}
  // }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { utcOffset: 7 })
  async startSyncToday() {
    const startOfToday = DTimer.startOfDate(new Date(), 7)
    await this.syncItemService.startSync(startOfToday.getTime() - 1)
  }
}
