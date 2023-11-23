import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import MongodbConfigService from './mongodb.config'
import { ItemRepository } from './repository/item/item.repository'
import { ItemSchema } from './repository/item/item.schema'
import { WarehouseCheckoutRepository } from './repository/warehouse-checkout/warehouse-checkout.repository'
import { WarehouseCheckoutSchema } from './repository/warehouse-checkout/warehouse-checkout.schema'
import { WarehouseExportRepository } from './repository/warehouse-export/warehouse-export.repository'
import { WarehouseExportSchema } from './repository/warehouse-export/warehouse-export.schema'
import { WarehouseImportRepository } from './repository/warehouse-import/warehouse-import.repository'
import { WarehouseImportSchema } from './repository/warehouse-import/warehouse-import.schema'
import { WarehouseTransferRepository } from './repository/warehouse-transfer/warehouse-transfer.repository'
import { WarehouseTransferSchema } from './repository/warehouse-transfer/warehouse-transfer.schema'

@Global()
@Module({
	imports: [
		MongooseModule.forRootAsync({ useClass: MongodbConfigService }),
		MongooseModule.forFeature([
			{ name: 'ItemSchema', schema: ItemSchema },
			{ name: 'WarehouseImportSchema', schema: WarehouseImportSchema },
			{ name: 'WarehouseExportSchema', schema: WarehouseExportSchema },
			{ name: 'WarehouseTransferSchema', schema: WarehouseTransferSchema },
			{ name: 'WarehouseCheckoutSchema', schema: WarehouseCheckoutSchema },
		]),
	],
	providers: [
		ItemRepository,
		WarehouseImportRepository,
		WarehouseExportRepository,
		WarehouseTransferRepository,
		WarehouseCheckoutRepository,
	],
	exports: [
		ItemRepository,
		WarehouseImportRepository,
		WarehouseExportRepository,
		WarehouseTransferRepository,
		WarehouseCheckoutRepository,
	],
})
export class MongoDbConnectModule {}
