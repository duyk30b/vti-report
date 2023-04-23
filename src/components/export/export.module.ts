import { UserModule } from '@components/user/user.module';
import { WarehouseService } from '@components/warehouse/warehouse.service';
import { ConfigService } from '@core/config/config.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyWarehouseItemStockRepository } from '@repositories/daily-warehouse-item-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { ReportOrderItemRepository } from '@repositories/report-order-item.repository';
import { ReportOrderRepository } from '@repositories/report-order.repository';
import { TransactionItemRepository } from '@repositories/transaction-item.repository';

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
import { ReportOrder, ReportOrderSchema } from '@schemas/report-order.schema';
import {
  TransactionItem,
  TransactionItemSchema,
} from '@schemas/transaction-item.schema';

import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { WarehouseModule } from '@components/warehouse/warehouse.module';
import { InventoryQuantityNormsRepository } from '@repositories/inventory-quantity-norms.repository';
import {
  InventoryQuantityNormModel,
  InventoryQuantityNormSchema,
} from '@schemas/inventory-quantity-norms.model';
import {
  DailyItemWarehouseStockPrice,
  DailyItemWarehouseStockPriceSchema,
} from '@schemas/daily-item-warehouse-stock-price.schema';
import { DailyItemWarehouseStockPriceRepository } from '@repositories/daily-item-warehouse-stock-price.repository';
import {
  ReportReceipt,
  ReportReceiptSchema,
} from '@schemas/report-receipt.schema';
import { ReportReceiptRepository } from '@repositories/report-receipt.repository';
import {
  ReportItemPlanningQuantities,
  ReportItemPlanningQuantitiesSchema,
} from '@schemas/report-item-planning-quantitie.schema';
import { ReportItemPlanningQuantitesRepository } from '@repositories/report-item-planning-quantities.repository';

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
      {
        name: ReportOrder.name,
        schema: ReportOrderSchema,
      },
      {
        name: TransactionItem.name,
        schema: TransactionItemSchema,
      },
      {
        name: InventoryQuantityNormModel.name,
        schema: InventoryQuantityNormSchema,
      },
      {
        name: DailyItemWarehouseStockPrice.name,
        schema: DailyItemWarehouseStockPriceSchema,
      },
      {
        name: ReportReceipt.name,
        schema: ReportReceiptSchema,
      },
      {
        name: ReportItemPlanningQuantities.name,
        schema: ReportItemPlanningQuantitiesSchema,
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
    {
      provide: ReportOrderRepository.name,
      useClass: ReportOrderRepository,
    },
    {
      provide: TransactionItemRepository.name,
      useClass: TransactionItemRepository,
    },
    {
      provide: InventoryQuantityNormsRepository.name,
      useClass: InventoryQuantityNormsRepository,
    },
    {
      provide: DailyItemWarehouseStockPriceRepository.name,
      useClass: DailyItemWarehouseStockPriceRepository,
    },
    {
      provide: ReportReceipt.name,
      useClass: ReportReceiptRepository,
    },
    {
      provide: ReportItemPlanningQuantities.name,
      useClass: ReportItemPlanningQuantitesRepository,
    },
  ],
})
export class ExportModule {}
