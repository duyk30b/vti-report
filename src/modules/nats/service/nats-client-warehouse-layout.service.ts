import { Injectable } from '@nestjs/common'
import { NatsClientService } from '../nats-client.service'
import { NatsResponseInterface } from '../nats.interface'
import { NatsSubject } from '../nats.config'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'

export type GetLocatorsRequest = {
	id?: string
	warehouseId?: number
	level?: number

	ids?: string[]
	warehouseIds?: number[]
}

@Injectable()
export class NatsClientWarehouseLayoutService {
	constructor(private readonly natsClient: NatsClientService) { }

	async getLocatorsBy(data: GetLocatorsRequest): Promise<any[]> {
		const response: NatsResponseInterface = await this.natsClient.send(
			NatsSubject.WAREHOUSE_LAYOUT.GET_LOCATORS,
			data
		)
		if (response.statusCode !== 200) {
			throw new BusinessException(response.message as any)
		}
		return response.data
	}
}
