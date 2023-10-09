import { Injectable } from '@nestjs/common'
import { NatsClientAttributeService } from 'src/modules/nats/service/nats-client-attribute.service'
import { NatsClientItemService } from 'src/modules/nats/service/nats-client-item.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { EventWarehouseTransferConfirmRequest } from '../request'

@Injectable()
export class EventWarehouseTransferService {
	constructor(
		private readonly natsClientWarehouseService: NatsClientWarehouseService,
		private readonly natsClientAttributeService: NatsClientAttributeService,
		private readonly natsClientItemService: NatsClientItemService
	) { }

	async warehouseTransferConfirm(request: EventWarehouseTransferConfirmRequest) {
		console.log('🚀 ~ file: event-warehouse-transfer.service.ts:16 ~ EventWarehouseTransferService ~ warehouseTransferConfirm ~ request:', request)
	}
}
