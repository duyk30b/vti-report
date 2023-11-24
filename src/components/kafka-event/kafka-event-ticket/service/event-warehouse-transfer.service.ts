import { Injectable } from '@nestjs/common'
import { timeToText } from 'src/common/helpers'
import { NatsClientAttributeService } from 'src/modules/nats/service/nats-client-attribute.service'
import { NatsClientItemService } from 'src/modules/nats/service/nats-client-item.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { WarehouseTransferRepository } from 'src/mongo/repository/warehouse-transfer/warehouse-transfer.repository'
import { WarehouseTransferType } from 'src/mongo/repository/warehouse-transfer/warehouse-transfer.schema'
import { EventWarehouseTransferRequest } from '../request'

@Injectable()
export class EventWarehouseTransferService {
  constructor(
    private readonly natsClientWarehouseService: NatsClientWarehouseService,
    private readonly natsClientAttributeService: NatsClientAttributeService,
    private readonly natsClientItemService: NatsClientItemService,
    private readonly warehouseTransferRepository: WarehouseTransferRepository
  ) {}

  async warehouseTransferComplete(request: EventWarehouseTransferRequest) {
    const daySyncString = timeToText(new Date(), 'YYYY-MM-DD', -420)

    const ticket = request.data
    ticket.attributeMap = {}
    ticket.attributes.forEach((atr: { code: string; value: any }) => {
      ticket.attributeMap[atr.code] = atr.value
    })

    const itemIdSet = new Set<number>()
    ticket.ticketDetails.forEach((td: any) => {
      itemIdSet.add(td.itemId)
      td.attributeMap = {} as Record<string, any>
      td.attributes.forEach((atr: { code: string; value: any }) => {
        td.attributeMap[atr.code] = atr.value
      })
      td.amount = td.quantity * (td.price || 0)
      const price = td.price || 0
      const quantity = td.quantity || 0
      td.price = td.price != null ? td.price : price
      td.quantity = td.quantity != null ? td.quantity : quantity
      td.amount = td.amount != null ? td.amount : price * quantity
    })
    const itemIds = Array.from(itemIdSet)

    const [warehouses, templates, items] = await Promise.all([
      this.natsClientWarehouseService.getWarehouses({ ids: [ticket.warehouseImportId, ticket.warehouseExportId] }),
      this.natsClientAttributeService.getTemplatesByIds({ ids: [ticket.templateId.toString()] }),
      this.natsClientItemService.getItemsByIds({ itemIds }),
    ])
    const itemMap: Record<string, any> = {}
    items.forEach((i: any) => (itemMap[i.id] = i))
    const warehouseMap: Record<string, any> = {}
    warehouses.forEach((i: any) => (warehouseMap[i.id] = i))

    const warehouseTransfer: WarehouseTransferType = {
      timeSync: new Date(daySyncString),
      warehouseImportId: ticket.warehouseImportId,
      warehouseImportName: warehouseMap[ticket.warehouseImportId].name,
      warehouseExportId: ticket.warehouseExportId,
      warehouseExportName: warehouseMap[ticket.warehouseExportId].name,
      templateCode: templates[0].code,
      templateName: templates[0].name,
      ticketId: ticket._id.toString(),
      ticketCode: ticket.code,
      documentDate: ticket.attributeMap['wmsxCreateReceiptDate']
        ? new Date(ticket.attributeMap['wmsxCreateReceiptDate'])
        : null,
      transferDate: ticket.transferDate ? new Date(ticket.transferDate) : new Date(),
      description: ticket.attributeMap['wmsxGeneralDescription'] || '',
      transferStatus: ticket.status,
      amount: ticket.ticketDetails.reduce((acc: number, cur: any) => acc + cur.amount, 0),

      items: ticket.ticketDetails.map((ticketDetail: any) => {
        const item = itemMap[ticketDetail.itemId]
        return {
          itemCode: item.code,
          itemName: item.name,
          unit: item.itemUnit.name,
          lot: ticketDetail.lot,
          manufacturingDate: ticketDetail.mfgDate ? new Date(ticketDetail.mfgDate) : null,
          importDate: ticketDetail.importDate ? new Date(ticketDetail.importDate) : null,
          quantity: ticketDetail.quantity,
          price: ticketDetail.price,
          amount: ticketDetail.amount,
        }
      }),
    }

    await this.warehouseTransferRepository.insertOne(warehouseTransfer)
  }
}
