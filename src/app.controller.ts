import { NATS_AUTH, NATS_REPORT } from '@core/config/nats.config';
import { Public } from '@core/decorator/set-public.decorator';
import { NatsClientService } from '@core/transporter/nats-transporter/nats-client.service';
import { ResponseBuilder } from '@core/utils/response-builder';
import { Body, Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('')
@ApiBearerAuth('access-token')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly natsClientService: NatsClientService,
  ) {}

  @Public()
  @Get('/health')
  getHealth(): string {
    return this.appService.getHealth();
  }

  @MessagePattern(`${NATS_REPORT}.ping`)
  pingServer(@Body() body: any) {
    return new ResponseBuilder()
      .withData({ msg: `${NATS_REPORT}: pong`, data: body })
      .build();
  }

  @Get('ping-nats')
  async pingNats(): Promise<any> {
    const pingAuth = await this.natsClientService.send(`${NATS_AUTH}.ping`, {
      msg: 'ping',
      queue: NATS_AUTH,
    });
    const pingSelf = await this.natsClientService.send(`${NATS_REPORT}.ping`, {
      msg: 'ping',
      queue: NATS_REPORT,
    });
    return new ResponseBuilder()
      .withData({ data: { pingSelf, pingAuth } })
      .build();
  }
}
