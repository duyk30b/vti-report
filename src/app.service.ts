import { ResponseBuilder } from '@core/utils/response-builder';
import { Injectable } from '@nestjs/common';
import { ResponseCodeEnum } from '@core/response-code.enum';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): any {
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage('This is Warehouse-layout-service')
      .build();
  }
}
