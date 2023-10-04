import { Injectable } from '@nestjs/common'
import { NatsResponseInterface } from 'src/modules/nats/nats.interface'

@Injectable()
export class NatsEventService {
	constructor() { }

	async pong(data: any) {
		return {
			meta: data,
			data: {
				message: 'report-service: pong',
				time: Date.now(),
			},
		}
	}
}
