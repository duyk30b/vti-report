import { Injectable } from '@nestjs/common'
import { NatsClientService } from '../nats-client.service'
import { NatsResponseInterface } from '../nats.interface'
import { NatsSubject } from '../nats.config'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'

@Injectable()
export class NatsClientTicketService {
	constructor(private readonly natsClient: NatsClientService) { }

	async getWarehouseImportList(condition?: {
		limit?: number,
		confirmedTime?: [number, number],
		createdAt?: [number, number]
	}): Promise<any[]> {
		const response: NatsResponseInterface = await this.natsClient.send(
			NatsSubject.TICKET.GET_WAREHOUSE_IMPORT_LIST,
			condition
		)
		if (response.statusCode !== 200) {
			throw new BusinessException(response.message as any)
		}
		return response.data
	}

	async getWarehouseTransferList(data: any): Promise<NatsResponseInterface> {
		return this.natsClient.send(NatsSubject.TICKET.GET_WAREHOUSE_TRANSFER_LIST, data)
	}

	async getWarehouseExportList(data: any): Promise<NatsResponseInterface> {
		return this.natsClient.send(NatsSubject.TICKET.GET_WAREHOUSE_EXPORT_LIST, data)
	}

	async getWarehouseCheckoutList(data: any): Promise<NatsResponseInterface> {
		return this.natsClient.send(NatsSubject.TICKET.GET_WAREHOUSE_CHECKOUT_LIST, data)
	}
}
