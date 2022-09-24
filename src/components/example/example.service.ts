import { ResponseCodeEnum } from '@core/response-code.enum';
import { ResponseBuilder } from '@core/utils/response-builder';
import { ResponsePayload } from '@core/utils/response-payload';
import { Inject, Injectable } from '@nestjs/common';
import { ExampleRepository } from '@repositories/example.repository';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ExampleRequest } from 'src/requests/example/example.request';

@Injectable()
export class ExampleService {
  constructor(
    @Inject('ExampleRepository')
    private readonly exampleRepository: ExampleRepository,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async create(request: ExampleRequest): Promise<ResponsePayload<any>> {
    try {
      await this.exampleRepository.create(request);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (e) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }
}
