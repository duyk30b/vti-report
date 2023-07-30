import { Injectable } from '@nestjs/common';
import { AuthServiceInterface } from '@components/auth/interface/auth.service.interface';
import { InjectService } from '@nestcloud/service';
import { NATS_AUTH } from '@core/config/nats.config';
import { NatsClientService } from '@core/transporter/nats-transporter/nats-client.service';

@Injectable()
export class AuthService implements AuthServiceInterface {
  private httpConfig;

  private endpoint;

  constructor(
    private readonly natsClientService: NatsClientService,

    @InjectService()
    private readonly service: any,
  ) {
    this.endpoint = '/api/v1/auth';
    this.httpConfig = {
      scalingDuration: 1000,
      excludedStatusCodes: [409],
      callInternalService: true,
      serviceName: 'auth-service',
    };
  }

  async generateUrlInternalService(
    serviceName: string,
    url: string,
  ): Promise<string> {
    const servers = this.service.getServiceServers(serviceName, {
      passing: true,
    });

    const server = servers[Math.floor(Math.random() * servers.length)];

    return `http://${server.address}:${server.port}${url}`;
  }

  async validateToken(token: string, permissionCode: string): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_AUTH}.validate_token`,
      {
        permissionCode,
        token,
      },
    );
    return response;
  }

  // async validateToken(token: string, permissionCode: string): Promise<any> {
  //   this.httpClientService.axiosRef.defaults.headers.common[
  //     'authorization'
  //   ] = `${token}`;
  //   const url = await this.generateUrlInternalService(
  //     this.httpConfig.serviceName,
  //     `${this.endpoint}/token/validate`,
  //   );
  //   return await firstValueFrom(
  //     this.httpClientService
  //       .get(url, {
  //         params: {
  //           permissionCode: permissionCode,
  //         },
  //       })
  //       .pipe(
  //         map((response) => response.data),
  //         retry(
  //           genericRetryStrategy({
  //             scalingDuration: 1000,
  //             excludedStatusCodes: [409],
  //           }),
  //         ),
  //         catchError((error) => of(error)),
  //       ),
  //   );
  // }
}
