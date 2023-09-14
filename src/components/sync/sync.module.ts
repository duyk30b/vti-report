import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { UserModule } from '@components/user/user.module';
import { DailyReportStockRepository } from '@repositories/daily-report-stock.repository';
import {
  DailyReportStock,
  DailyReportStockSchema,
} from '@schemas/daily-report-stock.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DailyReportStock.name,
        schema: DailyReportStockSchema,
      },
    ]),
    UserModule,
  ],
  providers: [
    {
      provide: 'SyncService',
      useClass: SyncService,
    },
    {
      provide: 'DailyReportStockRepository',
      useClass: DailyReportStockRepository,
    },
  ],
  controllers: [SyncController],
})
export class SyncModule {}
