import { DailyLotLocatorStock } from './../../schemas/daily-lot-locator-stock.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { Global, Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ConfigService } from '@core/config/config.service';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyLotLocatorStockSchema } from '@schemas/daily-lot-locator-stock.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DailyLotLocatorStock.name,
        schema: DailyLotLocatorStockSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: 'DashboardServiceInterface',
      useClass: DashboardService,
    },
    {
      provide: 'ConfigServiceInterface',
      useClass: ConfigService,
    },
    {
      provide: DailyLotLocatorStockRepository.name,
      useClass: DailyLotLocatorStockRepository,
    },
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
