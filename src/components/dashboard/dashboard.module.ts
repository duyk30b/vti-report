import { DailyItemWarehouseStockPrice, DailyItemWarehouseStockPriceSchema } from '@schemas/daily-item-warehouse-stock-price.schema';
import { DailyLotLocatorStock } from './../../schemas/daily-lot-locator-stock.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { Global, Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ConfigService } from '@core/config/config.service';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyLotLocatorStockSchema } from '@schemas/daily-lot-locator-stock.schema';
import { DailyItemWarehouseStockPriceRepository } from '@repositories/daily-item-warehouse-stock-price.repository';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DailyLotLocatorStock.name,
        schema: DailyLotLocatorStockSchema,
      },
      {
        name: DailyItemWarehouseStockPrice.name,
        schema: DailyItemWarehouseStockPriceSchema,
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
    {
      provide: DailyItemWarehouseStockPriceRepository.name,
      useClass: DailyItemWarehouseStockPriceRepository,
    },
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
