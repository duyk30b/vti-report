import { ConfigService } from '@core/config/config.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [ConfigModule],
  exports: [
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
  ],
  controllers: [],
})
export class WarehouseModule {}
