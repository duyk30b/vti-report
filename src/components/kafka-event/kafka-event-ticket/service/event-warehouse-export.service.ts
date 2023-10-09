import { Injectable } from '@nestjs/common'
import { timeToText } from 'src/common/helpers'
import { NatsClientAttributeService } from 'src/modules/nats/service/nats-client-attribute.service'
import { NatsClientItemService } from 'src/modules/nats/service/nats-client-item.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { WarehouseExportRepository } from 'src/mongo/repository/warehouse-export/warehouse-export.repository'
import { WarehouseExport } from 'src/mongo/repository/warehouse-export/warehouse-export.schema'
import { EventWarehouseExportConfirmRequest } from '../request'

@Injectable()
export class EventWarehouseExportService {
	constructor(
		private readonly natsClientWarehouseService: NatsClientWarehouseService,
		private readonly natsClientAttributeService: NatsClientAttributeService,
		private readonly natsClientItemService: NatsClientItemService,
		private readonly warehouseExportRepository: WarehouseExportRepository
	) { }

	async warehouseExportConfirm(request: EventWarehouseExportConfirmRequest) {
		const daySyncString = timeToText(new Date(), 'YYYY-MM-DD', -420)

		const ticket = request.data
		ticket.attributeMap = {}
		ticket.attributes.forEach((atr: { code: string, value: any }) => {
			ticket.attributeMap[atr.code] = atr.value
		})

		const itemIdSet = new Set<number>()
		ticket.ticketDetails.forEach((td: any) => {
			itemIdSet.add(td.itemId)
			td.attributeMap = {} as Record<string, any>
			td.attributes.forEach((atr: { code: string, value: any }) => {
				td.attributeMap[atr.code] = atr.value
			})
		})
		const itemIds = Array.from(itemIdSet)
		const [warehouses, templates, items] = await Promise.all([
			this.natsClientWarehouseService.getWarehousesByIds({ warehouseIds: [ticket.warehouseId] }),
			this.natsClientAttributeService.getTemplatesByIds({ ids: [ticket.templateId.toString()] }),
			this.natsClientItemService.getItemsByIds({ itemIds }),
		])
		const itemMap: Record<string, any> = {}
		items.forEach((i: any) => itemMap[i.id] = i)

		const warehouseExport: Partial<WarehouseExport> = {
			timeSync: new Date(daySyncString),
			warehouseId: warehouses[0].id,
			warehouseName: warehouses[0].name,
			templateCode: templates[0].code,
			templateName: templates[0].name,
			ticketId: ticket._id.toString(),
			ticketCode: ticket.code,
			documentDate: ticket.attributeMap['wmsxCreateReceiptDate'] ? new Date(ticket.attributeMap['wmsxCreateReceiptDate']) : null,
			exportDate: ticket.exportDate ? new Date(ticket.exportDate) : new Date(),
			description: ticket.attributeMap['wmsxGeneralDescription'] || '',
			amount: ticket.ticketDetails.reduce((acc: number, cur: any) => {
				return acc + (cur.quantity * (cur.price || cur.attributeMap['wmsxPrice']))
			}, 0),
			items: ticket.ticketDetails.map((ticketDetail: any) => {
				const item = itemMap[ticketDetail.itemId]
				const price = ticketDetail.price || ticketDetail.attributeMap['wmsxPrice']
				const { quantity } = ticketDetail
				return {
					itemCode: item.code,
					lot: ticketDetail.lot,
					price,
					quantity,
					amount: ticketDetail.amount != null ? ticketDetail.amount : price * quantity,
					manufacturingDate: ticketDetail.mfgDate ? new Date(ticketDetail.mfgDate) : null,
					importDate: ticketDetail.importDate ? new Date(ticketDetail.importDate) : null,
					itemName: item.name,
					unit: item.itemUnit.name,
				}
			}),
		}

		await this.warehouseExportRepository.insertOne(warehouseExport)
	}
}
