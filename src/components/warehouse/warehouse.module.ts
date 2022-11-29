import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@core/config/config.service';

@Module({
  imports: [ConfigModule],
  exports: [
    'WAREHOUSE_SERVICE_CLIENT',
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
  ],
  providers: [
    ConfigService,
    {
      provide: 'WAREHOUSE_SERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const warehouseServiceOptions = configService.get('warehouseService');
        return ClientProxyFactory.create(warehouseServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'WarehouseServiceInterface',
      useClass: WarehouseService,
    },
  ],
  controllers: [],
})
export class WarehouseModule {}
