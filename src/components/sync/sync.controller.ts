import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { SuccessResponse } from '@core/utils/success.response.dto';
import { ResponsePayload } from '@core/utils/response-payload';
import { SyncService } from './sync.service';
import { BaseDto } from '@core/dto/base.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SyncReportDailyRequestDto } from './dto/request/sync-report-daily.request.dto';
import { SYNC_REPORT_DAILY_TOPIC } from './sync.constants';

@Controller('sync')
export class SyncController {
  constructor(
    @Inject('SyncService')
    private readonly syncService: SyncService,
  ) {}

  @Post('/')
  @ApiOperation({
    tags: ['Sync'],
    summary: 'Đồng bộ dữ liệu',
    description: 'Đồng bộ dữ liệu',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async sync(@Body() payload: BaseDto): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.sync();
  }

  @MessagePattern(SYNC_REPORT_DAILY_TOPIC)
  async readMessage(
    @Payload() body: SyncReportDailyRequestDto
  ): Promise<ResponsePayload<any>> {
    const { request } = body;
    return await this.syncService.saveItemStockWarehouseLocatorByDate(request.value);
  }
}
