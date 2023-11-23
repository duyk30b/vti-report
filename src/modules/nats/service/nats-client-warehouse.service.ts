import { Injectable } from '@nestjs/common'
import { NatsClientService } from '../nats-client.service'
import { NatsResponseInterface } from '../nats.interface'
import { NatsSubject } from '../nats.config'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'

export type GetWarehousesRequest = {
	id?: number
	ids?: number[]
	code?: string
	codes?: string[]
	status?: number
	statuses?: number[]
}
@Injectable()
export class NatsClientWarehouseService {
	constructor(private readonly natsClient: NatsClientService) {}

	async getWarehouses(data: GetWarehousesRequest): Promise<any[]> {
		const response: NatsResponseInterface = await this.natsClient.send(NatsSubject.WAREHOUSE.GET_WAREHOUSES, data)
		if (response.statusCode !== 200) {
			throw new BusinessException(response.message as any)
		}
		return response.data
	}
}
