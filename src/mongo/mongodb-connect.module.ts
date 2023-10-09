import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import MongodbConfigService from './mongodb.config'
import { InventoryRepository } from './repository/inventory/inventory.repository'
import { InventorySchema } from './repository/inventory/inventory.schema'
import { WarehouseExportRepository } from './repository/warehouse-export/warehouse-export.repository'
import { WarehouseExportSchema } from './repository/warehouse-export/warehouse-export.schema'
import { WarehouseImportRepository } from './repository/warehouse-import/warehouse-import.repository'
import { WarehouseImportSchema } from './repository/warehouse-import/warehouse-import.schema'

@Global()
@Module({
	imports: [
		MongooseModule.forRootAsync({ useClass: MongodbConfigService }),
		MongooseModule.forFeature([
			{ name: 'InventorySchema', schema: InventorySchema },
			{ name: 'WarehouseImportSchema', schema: WarehouseImportSchema },
			{ name: 'WarehouseExportSchema', schema: WarehouseExportSchema },
		]),
	],
	providers: [
		InventoryRepository,
		WarehouseImportRepository,
		WarehouseExportRepository,
	],
	exports: [
		InventoryRepository,
		WarehouseImportRepository,
		WarehouseExportRepository,
	],
})
export class MongoDbConnectModule { }
