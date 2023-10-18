import { Injectable, Logger } from '@nestjs/common'
import { startOfDay, timeToText } from 'src/common/helpers'
import { NatsClientItemService } from 'src/modules/nats/service/nats-client-item.service'
import { NatsClientWarehouseLayoutService } from 'src/modules/nats/service/nats-client-warehouse-layout.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { ItemRepository } from 'src/mongo/repository/item/item.repository'
import { EItemStatus, ItemType } from 'src/mongo/repository/item/item.schema'
import { WarehouseImport } from 'src/mongo/repository/warehouse-import/warehouse-import.schema'

@Injectable()
export class SyncItemService {
	private readonly logger = new Logger(SyncItemService.name)

	constructor(
		private readonly natsClientItemService: NatsClientItemService,
		private readonly natsClientWarehouseService: NatsClientWarehouseService,
		private readonly natsClientWarehouseLayoutService: NatsClientWarehouseLayoutService,
		private readonly itemRepository: ItemRepository
	) { }

	async startSyncTime(timestamp: number) {
		const daySync = new Date(timestamp - 24 * 60 * 60 * 1000) // đồng bộ tất cả dữ liệu ngày hôm trước
		const daySyncString = timeToText(daySync, 'YYYY-MM-DD', -420)

		let page = 1
		let total: number
		const limit = 1000
		do {
			const response = await this.natsClientItemService.getItemsReport({ page, limit })
			await this.syncBatch(response.data, daySyncString)
			total = response.total as number
			page++
		} while (page * limit < total)
	}

	async syncBatch(data: any, daySyncString: string) {
		const locatorIdSet = new Set<string>()
		const warehouseIdSet = new Set<number>()

		data.forEach((itemRoot: any) => {
			itemRoot.stocks.forEach((stockRoot: any) => {
				warehouseIdSet.add(stockRoot.warehouseId)
				locatorIdSet.add(stockRoot.ticketLocatorId)
			})
		})
		const warehouseIds = Array.from(warehouseIdSet)
		const locatorIds = Array.from(locatorIdSet)

		const [warehouses, locators, locatorsVirtual] = await Promise.all([
			this.natsClientWarehouseService.getWarehousesByIds({ warehouseIds }),
			this.natsClientWarehouseLayoutService.getLocatorsBy({ ids: locatorIds }),
			this.natsClientWarehouseLayoutService.getLocatorsBy({ warehouseIds, level: 0 }), // level=0 là vị trí ảo
		])
		const locatorVirtualIds = locatorsVirtual.map((locator) => locator._id)
		const locatorMap: Record<string, any> = {}
		locators.forEach((locator) => locatorMap[locator._id] = locator)

		const itemMapWithWarehouse: Record<string, ItemType> = {}
		data.forEach((itemRoot: any) => {
			itemRoot.stocks.forEach((stockRoot: any) => {
				const key = `${stockRoot.warehouseId}_${stockRoot.itemId}`
				if (!itemMapWithWarehouse[key]) {
					itemMapWithWarehouse[key] = {
						timeSync: new Date(daySyncString),
						warehouseId: stockRoot.warehouseId,
						itemId: stockRoot.itemId,
						itemCode: itemRoot.code,
						itemName: itemRoot.name,
						unit: itemRoot.itemUnit?.name,
						stocks: [],
						quantity: 0,
					}
				}

				let status: EItemStatus
				if (locatorVirtualIds.includes(stockRoot.ticketLocatorId)) {
					status = EItemStatus.Import
				}
				if (stockRoot?.isPutAway) {
					status = EItemStatus.ImportAndPutAway
				}
				if (stockRoot?.isPickedUp) {
					status = EItemStatus.Pickup
				}

				itemMapWithWarehouse[key].stocks.push({
					lot: stockRoot.lotNumber,
					manufacturingDate: stockRoot.mfg ? new Date(stockRoot.mfg) : null,
					importDate: stockRoot.storageDate ? new Date(stockRoot.storageDate) : null,
					locatorId: stockRoot.ticketLocatorId,
					locatorName: locatorMap[stockRoot.ticketLocatorId]?.pathName,
					status,
					quantity: Number(stockRoot.quantity),
				})
				itemMapWithWarehouse[key].quantity += Number(stockRoot.quantity)
			})
		})

		const itemSnap: ItemType[] = Object.values(itemMapWithWarehouse)

		await this.itemRepository.insertMany(itemSnap)
	}
}