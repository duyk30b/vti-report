import { Inject, Injectable } from '@nestjs/common'
import { ClientNats } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { NatsSubject } from './nats.config'
import { NatsResponseInterface } from './nats.interface'

@Injectable()
export class NatsClientService {
	constructor(@Inject('NATS_CLIENT_SERVICE') private readonly natsClient: ClientNats) { }

	async send(pattern: string, data: any): Promise<NatsResponseInterface> {
		const request = this.natsClient.send(pattern, data)
		return await firstValueFrom(request)
	}
}
