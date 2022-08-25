import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExampleRequest } from 'src/requests/example/example.request';
import { ExampleService } from './example.service';
import { isEmpty } from 'lodash';
import { SuccessResponse } from '@core/utils/success.response.dto';
import { ResponsePayload } from '@core/utils/response-payload';

@Controller('examples')
export class ExampleController {
  constructor(
    @Inject('ExampleService')
    private readonly exampleService: ExampleService,
  ) {}

  @Post('/create')
  @ApiOperation({
    tags: ['Create example'],
    summary: 'Tạo mới 1 ví dụ',
    description: 'Tạo mới 1 ví dụ',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async create(@Body() payload: ExampleRequest): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.exampleService.create(request);
  }
}
