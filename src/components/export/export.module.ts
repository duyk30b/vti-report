import { UserModule } from '@components/user/user.module';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { ConfigService } from '@core/config/config.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { WarehouseModule } from '@components/warehouse/warehouse.module';
import {
  DailyReportStock,
  DailyReportStockSchema,
} from '@schemas/daily-report-stock.schema';
import { DailyReportStockRepository } from '@repositories/daily-report-stock.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DailyReportStock.name,
        schema: DailyReportStockSchema,
      },
    ]),
    UserModule,
    WarehouseModule,
  ],
  controllers: [ExportController],
  providers: [
    ConfigService,
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
    {
      provide: ExportService.name,
      useClass: ExportService,
    },
    {
      provide: DailyReportStockRepository.name,
      useClass: DailyReportStockRepository,
    },
  ],
})
export class ExportModule {}
