import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyItemLocatorStockRepository } from '@repositories/daily-item-locator-stock.repository';
import { DailyItemLocatorStock, DailyItemLocatorStockSchema } from '@schemas/daily-item-locator-stock.schema';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DailyItemLocatorStock.name,
        schema: DailyItemLocatorStockSchema,
      },
    ])
  ],
  providers: [
    {
      provide: 'SyncService',
      useClass: SyncService,
    },
    {
      provide: 'DailyItemLocatorStockRepository',
      useClass: DailyItemLocatorStockRepository,
    }
  ],
  controllers: [SyncController],
})
export class SyncModule {}
