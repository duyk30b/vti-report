import { Injectable } from '@nestjs/common'
import { NatsClientService } from '../nats-client.service'
import { NatsResponseInterface } from '../nats.interface'
import { NatsSubject } from '../nats.config'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'

@Injectable()
export class NatsClientWarehouseService {
	constructor(private readonly natsClient: NatsClientService) { }

	async getWarehousesByIds(data: { warehouseIds: number[] }): Promise<any[]> {
		const response: NatsResponseInterface = await this.natsClient.send(
			NatsSubject.WAREHOUSE.GET_WAREHOUSES_BY_IDS,
			data
		)
		if (response.statusCode !== 200) {
			throw new BusinessException(response.message as any)
		}
		return response.data
	}
}
