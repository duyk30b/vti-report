import { Module } from '@nestjs/common'
import { SyncItemService } from './jobs/sync-item.service'
import { TasksScheduleService } from './tasks-schedule.service'

@Module({
	imports: [],
	controllers: [],
	providers: [
		TasksScheduleService,
		SyncItemService,
	],
})
export class TasksScheduleModule { }
