import { Controller, Get } from '@nestjs/common'
import { Ctx, MessagePattern, NatsContext, Payload, Transport } from '@nestjs/microservices'
import { NatsClientService } from 'src/modules/nats/nats-client.service'
import { NatsSubject } from 'src/modules/nats/nats.config'
import { NatsEventService } from './nats-event.service'

@Controller()
export class NatsEventController {
	constructor(
		private readonly natsClientService: NatsClientService,
		private readonly natsEventService: NatsEventService
	) {
	}

	@Get('nats/ping-report')
	async pingReport() {
		const response = await this.natsClientService.send(NatsSubject.REPORT.PING, {
			client: 'report-service',
			server: 'report-service',
			message: 'ping',
			time: Date.now(),
		})
		return response
	}

	@Get('nats/ping-ticket')
	async pingTicket() {
		const response = await this.natsClientService.send(NatsSubject.TICKET.PING, {
			client: 'report-service',
			server: 'ticket-service',
			message: 'ping',
			time: Date.now(),
		})
		return response
	}

	@MessagePattern(NatsSubject.REPORT.PING, Transport.NATS)
	pong(@Payload() payload: any, @Ctx() context: NatsContext) {
		return this.natsEventService.pong(payload)
	}
}
