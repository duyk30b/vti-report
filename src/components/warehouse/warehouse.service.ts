import { Inject, Injectable } from '@nestjs/common';
import { WarehouseServiceInterface } from './interface/warehouse.service.interface';
import { ClientProxy } from '@nestjs/microservices';
import { ResponseCodeEnum } from '@constant/response-code.enum';
import { REQUEST } from '@nestjs/core';
@Injectable()
export class WarehouseService implements WarehouseServiceInterface {
  constructor(
    @Inject('WAREHOUSE_SERVICE_CLIENT')
    private readonly warehouseServiceClient: ClientProxy,
  ) {}

  async getWarehouseByCode(code: string): Promise<any> {
    const response = await this.warehouseServiceClient
      .send('get_warehouses_by_code', { code })
      .toPromise();

    if (response?.statusCode !== ResponseCodeEnum.SUCCESS) {
      return null;
    }
    return response.data;
  }
}
