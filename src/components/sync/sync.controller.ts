import { Controller, Inject } from '@nestjs/common';
import { ResponsePayload } from '@core/utils/response-payload';
import { SyncService } from './sync.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessageSyncKafkaEnum } from './sync.constants';
import { SyncDailyReportStockRequestBody } from './dto/request/sync-daily-report-stock.request';

@Controller('sync')
export class SyncController {
  constructor(
    @Inject('SyncService')
    private readonly syncService: SyncService,
  ) {}

  @MessagePattern(MessageSyncKafkaEnum.SYNC_REPORT_DAILY_STOCK_TOPIC)
  async readMessageSyncDailyReportStock(
    @Payload() body: SyncDailyReportStockRequestBody,
  ): Promise<ResponsePayload<any>> {
    body.data = body?.['request']?.['value'] || [];
    return await this.syncService.syncDailyReportStock(body);
  }
}
