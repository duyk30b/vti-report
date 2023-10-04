import { Injectable, Logger } from '@nestjs/common'
import { endOfDay, startOfDay, timeToText } from 'src/common/helpers'
import { NatsClientAttributeService } from 'src/modules/nats/service/nats-client-attribute.service'
import { NatsClientItemService } from 'src/modules/nats/service/nats-client-item.service'
import { NatsClientTicketService } from 'src/modules/nats/service/nats-client-ticket.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { WarehouseImportRepository } from 'src/mongo/repository/warehouse-import/warehouse-import.repository'
import { WarehouseImport } from 'src/mongo/repository/warehouse-import/warehouse-import.schema'

@Injectable()
export class SyncWarehouseImportService {
	private readonly logger = new Logger(SyncWarehouseImportService.name)

	constructor(
		private readonly natsClientTicketService: NatsClientTicketService,
		private readonly natsClientWarehouseService: NatsClientWarehouseService,
		private readonly natsClientAttributeService: NatsClientAttributeService,
		private readonly natsClientItemService: NatsClientItemService,
		private readonly warehouseImportRepository: WarehouseImportRepository
	) { }

	async startSyncTime(timestamp: number) {
		const daySync = new Date(timestamp - 24 * 60 * 60 * 1000) // đồng bộ tất cả dữ liệu ngày hôm trước
		const daySyncString = timeToText(daySync, 'YYYY-MM-DD', -420)
		const startTime = startOfDay(daySync, -420).getTime() // -420 để lấy theo giờ UTC+7
		const endTime = startOfDay(timestamp, -420).getTime()

		const ticketImports = await this.natsClientTicketService.getWarehouseImportList({ confirmedTime: [startTime, endTime] })
		if (!ticketImports.length) {
			this.logger.log(`${daySyncString}: No Record Ticket Import`)
			return
		}

		const warehouseIdSet = new Set<number>()
		const templateIdSet = new Set<string>()
		const itemIdSet = new Set<number>()

		ticketImports.forEach((item: any) => {
			warehouseIdSet.add(item.warehouseId)
			templateIdSet.add(item.templateId.toString())
			item.ticketDetails.forEach((td: any) => {
				itemIdSet.add(td.itemId)
			})
		})

		const warehouseIds = Array.from(warehouseIdSet)
		const templateIds = Array.from(templateIdSet)
		const itemIds = Array.from(itemIdSet)

		const [warehouses, templates, items] = await Promise.all([
			this.natsClientWarehouseService.getWarehousesByIds({ warehouseIds }),
			this.natsClientAttributeService.getTemplatesByIds({ ids: templateIds }),
			this.natsClientItemService.getItemsByIds({ itemIds }),
		])

		const warehouseMap: Record<string, any> = {}
		const templateMap: Record<string, any> = {}
		const itemMap: Record<string, any> = {}

		warehouses.forEach((i: any) => warehouseMap[i.id] = i)
		templates.forEach((i: any) => templateMap[i._id] = i)
		items.forEach((i: any) => itemMap[i.id] = i)

		const warehouseImports: Partial<WarehouseImport>[] = ticketImports.map((ticket: any) => {
			const warehouse = warehouseMap[ticket.warehouseId]
			const template = templateMap[ticket.templateId]

			const documentDate = ticket.attributes.find((i: any) => i.code === 'wmsxCreateReceiptDate')?.value
			const description = ticket.attributes.find((i: any) => i.code === 'wmsxGeneralDescription')?.value

			return {
				timeSync: new Date(daySyncString),
				warehouseId: warehouse.id,
				warehouseName: warehouse.name,
				templateCode: template.code,
				templateName: template.name,
				ticketId: ticket._id.toString(),
				ticketCode: ticket.code,
				documentDate: documentDate ? new Date(documentDate) : null,
				importDate: ticket.ticketDetails[0]?.importDate ? new Date(ticket.ticketDetails[0]?.importDate) : null,
				description,
				amount: ticket.ticketDetails.reduce((acc: number, cur: any) => acc + cur.amount, 0),
				items: ticket.ticketDetails.map((ticketDetail: any) => {
					const item = itemMap[ticketDetail.itemId]
					return {
						itemCode: item.code,
						lot: ticketDetail.lot,
						price: ticketDetail.price,
						quantity: ticketDetail.quantity,
						amount: ticketDetail.amount,
						manufacturingDate: ticketDetail.mfgDate ? new Date(ticketDetail.mfgDate) : null,
						importDate: ticketDetail.importDate ? new Date(ticketDetail.importDate) : null,
						itemName: item.name,
						unit: item.itemUnit.name,
					}
				}),
			}
		})

		await this.warehouseImportRepository.deleteMany({ timeSync: new Date(daySyncString) })
		await this.warehouseImportRepository.insertMany(warehouseImports)
	}
}