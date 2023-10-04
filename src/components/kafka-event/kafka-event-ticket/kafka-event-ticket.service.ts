import { Injectable } from '@nestjs/common'
import { timeToText } from 'src/common/helpers'
import { NatsClientAttributeService } from 'src/modules/nats/service/nats-client-attribute.service'
import { NatsClientItemService } from 'src/modules/nats/service/nats-client-item.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { WarehouseImportRepository } from 'src/mongo/repository/warehouse-import/warehouse-import.repository'
import { WarehouseImport } from 'src/mongo/repository/warehouse-import/warehouse-import.schema'
import { KafkaTicketWarehouseImportConfirmRequest } from './request'

@Injectable()
export class KafkaTicketEventService {
	constructor(
		private readonly natsClientWarehouseService: NatsClientWarehouseService,
		private readonly natsClientAttributeService: NatsClientAttributeService,
		private readonly natsClientItemService: NatsClientItemService,
		private readonly warehouseImportRepository: WarehouseImportRepository
	) { }

	async ticketWarehouseImportConfirm(request: KafkaTicketWarehouseImportConfirmRequest) {
		const daySyncString = timeToText(new Date(), 'YYYY-MM-DD', -420)

		const ticket = request.data
		const itemIdSet = new Set<number>()
		ticket.ticketDetails.forEach((td: any) => {
			itemIdSet.add(td.itemId)
		})
		const itemIds = Array.from(itemIdSet)
		const [warehouses, templates, items] = await Promise.all([
			this.natsClientWarehouseService.getWarehousesByIds({ warehouseIds: [ticket.warehouseId] }),
			this.natsClientAttributeService.getTemplatesByIds({ ids: [ticket.templateId.toString()] }),
			this.natsClientItemService.getItemsByIds({ itemIds }),
		])
		const itemMap: Record<string, any> = {}
		items.forEach((i: any) => itemMap[i.id] = i)

		const documentDate = ticket.attributes.find((i: any) => i.code === 'wmsxCreateReceiptDate')?.value
		const description = ticket.attributes.find((i: any) => i.code === 'wmsxGeneralDescription')?.value

		const warehouseImport: Partial<WarehouseImport> = {
			timeSync: new Date(daySyncString),
			warehouseId: warehouses[0].id,
			warehouseName: warehouses[0].name,
			templateCode: templates[0].code,
			templateName: templates[0].name,
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

		await this.warehouseImportRepository.insertOne(warehouseImport)
	}
}
