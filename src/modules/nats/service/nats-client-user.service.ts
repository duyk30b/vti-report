import { Injectable } from '@nestjs/common'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'
import { NatsClientService } from '../nats-client.service'
import { NatsSubject } from '../nats.config'
import { NatsResponseInterface } from '../nats.interface'

@Injectable()
export class NatsClientUserService {
	constructor(private readonly natsClient: NatsClientService) { }

	async insertPermission(data: { permission: any[], groupPermission: any[] }): Promise<any> {
		const response: NatsResponseInterface = await this.natsClient.send(
			NatsSubject.USER.INSERT_PERMISSION,
			data
		)
		if (response.statusCode !== 200) {
			throw new BusinessException(response.message as any)
		}
		return response.data
	}

	async deletePermissionNotActive(): Promise<any> {
		const response: NatsResponseInterface = await this.natsClient.send(
			NatsSubject.USER.DELETE_PERMISSION_NOT_ACTIVE,
			{}
		)
		if (response.statusCode !== 200) {
			throw new BusinessException(response.message as any)
		}
		return response.data
	}

	async getUsersByIds(data: { userIds: number[] }): Promise<any[]> {
		const response: NatsResponseInterface = await this.natsClient.send(
			NatsSubject.USER.GET_USERS_BY_IDS,
			data
		)
		if (response.statusCode !== 200) {
			throw new BusinessException(response.message as any)
		}
		return response.data
	}
}
