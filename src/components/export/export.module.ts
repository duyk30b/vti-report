import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyWarehouseItemStockRepository } from '@repositories/daily-warehouse-item-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { ReportOrderItemRepository } from '@repositories/report-order-item.repository';

import {
  DailyLotLocatorStock,
  DailyLotLocatorStockSchema,
} from '@schemas/daily-lot-locator-stock.schema';
import {
  DailyWarehouseItemStock,
  DailyWarehouseItemStockSchema,
} from '@schemas/daily-warehouse-item-stock.schema';
import {
  ReportOrderItemLot,
  ReportOrderItemLotSchema,
} from '@schemas/report-order-item-lot.schema';
import {
  ReportOrderItem,
  ReportOrderItemSchema,
} from '@schemas/report-order-item.schema';

import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DailyLotLocatorStock.name,
        schema: DailyLotLocatorStockSchema,
      },
      {
        name: ReportOrderItemLot.name,
        schema: ReportOrderItemLotSchema,
      },
      {
        name: DailyWarehouseItemStock.name,
        schema: DailyWarehouseItemStockSchema,
      },
      {
        name: ReportOrderItem.name,
        schema: ReportOrderItemSchema,
      },
    ]),
  ],
  controllers: [ExportController],
  providers: [
    {
      provide: ExportService.name,
      useClass: ExportService,
    },

    {
      provide: DailyWarehouseItemStockRepository.name,
      useClass: DailyWarehouseItemStockRepository,
    },

    {
      provide: DailyLotLocatorStockRepository.name,
      useClass: DailyLotLocatorStockRepository,
    },

    {
      provide: ReportOrderItemLotRepository.name,
      useClass: ReportOrderItemLotRepository,
    },

    {
      provide: ReportOrderItemRepository.name,
      useClass: ReportOrderItemRepository,
    },
  ],
})
export class ExportModule {}
