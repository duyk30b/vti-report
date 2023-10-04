import { Module } from '@nestjs/common'
import { SyncWarehouseImportService } from './jobs/sync-warehouse-import.service'
import { TasksScheduleService } from './tasks-schedule.service'

@Module({
	imports: [],
	controllers: [],
	providers: [TasksScheduleService, SyncWarehouseImportService],
})
export class TasksScheduleModule { }
