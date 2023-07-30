import { ResponseCodeEnum } from '@constant/response-code.enum';
import { NatsClientService } from '@core/transporter/nats-transporter/nats-client.service';
import { Injectable } from '@nestjs/common';
import { WarehouseServiceInterface } from './interface/warehouse.service.interface';
import { NATS_WAREHOUSE } from '@core/config/nats.config';
@Injectable()
export class WarehouseService implements WarehouseServiceInterface {
  constructor(private readonly natsClientService: NatsClientService) {}

  async getWarehouseByCode(code: string): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_WAREHOUSE}.get_warehouses_by_code`,
      { code },
    );

    if (response?.statusCode !== ResponseCodeEnum.SUCCESS) {
      return null;
    }
    return response.data;
  }

  async getWarehouseByCodes(codes: string[]): Promise<any> {
    const response = await this.natsClientService.send(
      `${NATS_WAREHOUSE}.get_warehouse_by_codes`,
      { warehouseCodes: codes },
    );

    if (response.statusCode !== ResponseCodeEnum.SUCCESS) {
      return [];
    }

    return response.data;
  }
}
