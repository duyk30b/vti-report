import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DailyItemLocatorStock,
  DailyItemLocatorStockSchema,
} from '@schemas/daily-item-locator-stock.schema';
import { DailyItemLocatorStockRepository } from '@repositories/daily-item-locator-stock.repository';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyWarehouseItemStockRepository } from '@repositories/daily-warehouse-item-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { TransactionItemRepository } from '@repositories/transaction-item.repository';
import { ReportOrderItemRepository } from '@repositories/report-order-item.repository';
import { ReportOrderRepository } from '@repositories/report-order.repository';
import {
  DailyLotLocatorStock,
  DailyLotLocatorStockSchema,
} from '@schemas/daily-lot-locator-stock.schema';
import {
  DailyWarehouseItemStock,
  DailyWarehouseItemStockSchema,
} from '@schemas/daily-warehouse-item-stock.schema';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { ReportOrder, ReportOrderSchema } from '@schemas/report-order.schema';
import {
  ReportOrderItem,
  ReportOrderItemSchema,
} from '@schemas/report-order-item.schema';
import {
  ReportOrderItemLot,
  ReportOrderItemLotSchema,
} from '@schemas/report-order-item-lot.schema';
import {
  TransactionItem,
  TransactionItemSchema,
} from '@schemas/transaction-item.schema';
import { UserModule } from '@components/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DailyWarehouseItemStock.name,
        schema: DailyWarehouseItemStockSchema,
      },
      { name: DailyLotLocatorStock.name, schema: DailyLotLocatorStockSchema },
      { name: DailyItemLocatorStock.name, schema: DailyItemLocatorStockSchema },
      { name: ReportOrder.name, schema: ReportOrderSchema },
      { name: ReportOrderItem.name, schema: ReportOrderItemSchema },
      { name: ReportOrderItemLot.name, schema: ReportOrderItemLotSchema },
      { name: TransactionItem.name, schema: TransactionItemSchema },
    ]),
    UserModule,
  ],
  providers: [
    {
      provide: 'SyncService',
      useClass: SyncService,
    },
    {
      provide: 'DailyItemLocatorStockRepository',
      useClass: DailyItemLocatorStockRepository,
    },
    {
      provide: 'DailyLotLocatorStockRepository',
      useClass: DailyLotLocatorStockRepository,
    },
    {
      provide: 'DailyWarehouseItemStockRepository',
      useClass: DailyWarehouseItemStockRepository,
    },
    {
      provide: 'ReportOrderItemLotRepository',
      useClass: ReportOrderItemLotRepository,
    },
    {
      provide: 'ReportOrderItemRepository',
      useClass: ReportOrderItemRepository,
    },
    {
      provide: 'ReportOrderRepository',
      useClass: ReportOrderRepository,
    },
    {
      provide: 'TransactionItemRepository',
      useClass: TransactionItemRepository,
    },
  ],
  controllers: [SyncController],
})
export class SyncModule {}
