import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { SuccessResponse } from '@core/utils/success.response.dto';
import { ResponsePayload } from '@core/utils/response-payload';
import { SyncService } from './sync.service';
import { SyncTransactionRequest } from '@requests/sync-transaction.request';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SyncReportDailyRequestDto } from './dto/request/sync-report-daily.request.dto';
import { SYNC_REPORT_DAILY_TOPIC } from './sync.constants';
import { SyncOrderRequest } from '@requests/sync-purchased-order-import.request';
import { SyncSaleOrderExportRequest } from '@requests/sync-sale-order-export.request';
import { SyncWarehouseTransferRequest } from '@requests/sync-warehouse-transfer-request';
import { SyncDailyStockRequest } from '@requests/sync-daily.request';

@Controller('sync')
export class SyncController {
  constructor(
    @Inject('SyncService')
    private readonly syncService: SyncService,
  ) {}

  @Post('/test')
  @ApiOperation({
    tags: ['Sync'],
    summary: 'Đồng bộ dữ liệu hàng ngày',
    description: 'Đồng bộ dữ liệu order',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async syncDailyStock(
    @Body() payload: SyncDailyStockRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncDailyStock(request);
  }

  @Post('/orders/purchased-order-import')
  @ApiOperation({
    tags: ['Sync'],
    summary: 'Đồng bộ dữ liệu hàng ngày',
    description: 'Đồng bộ dữ liệu order',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async syncOrderImport(
    @Body() payload: SyncOrderRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncPurchasedOrderImport(request);
  }

  @Post('/orders/sale-order-export')
  @ApiOperation({
    tags: ['Sync'],
    summary: 'Đồng bộ dữ liệu hàng ngày',
    description: 'Đồng bộ dữ liệu order',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async syncOrderExport(
    @Body() payload: SyncSaleOrderExportRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    const res = await this.syncService.syncSaleOrderExport(request);

    return res;
  }

  @Post('/orders/warehouse-transfer')
  @ApiOperation({
    tags: ['Sync'],
    summary: 'Đồng bộ dữ liệu hàng ngày',
    description: 'Đồng bộ dữ liệu order',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async syncOrderTransfer(
    @Body() payload: SyncWarehouseTransferRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncWarehouseTransfer(request);
  }

  @Post('/transaction')
  @ApiOperation({
    tags: ['Sync'],
    summary: 'Đồng bộ dữ liệu giao dịch',
    description: 'Đồng bộ dữ liệu giao dịch',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  async syncTransaction(
    @Body() payload: SyncTransactionRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncTransaction(request);
  }

  @MessagePattern(SYNC_REPORT_DAILY_TOPIC)
  async readMessage(
    @Payload() body: SyncReportDailyRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request } = body;
    return await this.syncService.saveItemStockWarehouseLocatorByDate(
      request.value,
    );
  }
}
