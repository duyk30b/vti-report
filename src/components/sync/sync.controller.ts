import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { SuccessResponse } from '@core/utils/success.response.dto';
import { ResponsePayload } from '@core/utils/response-payload';
import { SyncService } from './sync.service';
import { TransactionRequest } from '@requests/sync-transaction.request';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SyncReportDailyRequestDto } from './dto/request/sync-report-daily.request.dto';
import { MessageSyncKafkaEnum } from './sync.constants';
import { SyncPurchasedOrderRequest } from '@requests/sync-purchased-order-import.request';
import { SyncSaleOrderExportRequest } from '@requests/sync-sale-order-export.request';
import { SyncWarehouseTransferRequest } from '@requests/sync-warehouse-transfer-request';
import { SyncInventory } from '@requests/sync-inventory-request';
import { InventoryAdjustmentRequest } from '@requests/inventory-adjustments.request';
import { InventoryQuantityNormsRequest } from '@requests/inventory-quantity-norms.request';
import { SyncItemWarehouseStockPriceRequestDto } from './dto/request/sync-item-warehouse-stock-price.request.dto';
import { ReceiptRequest } from '@requests/receipt.request';
import { ItemPlanningQuantitesRequest } from '@requests/report-item-planning-quantities.request';

@Controller('sync')
export class SyncController {
  constructor(
    @Inject('SyncService')
    private readonly syncService: SyncService,
  ) {}

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
    @Body() payload: SyncPurchasedOrderRequest,
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

  @Post('/orders/inventory-adjustments')
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
  async inventoryAdjustments(
    @Body() payload: InventoryAdjustmentRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    const res = await this.syncService.inventoryAdjustments(request);

    return res;
  }

  @Post('/orders/inventory-quantity-norms')
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
  async InventoryQuantityNorms(
    @Body() payload: InventoryQuantityNormsRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    const res = await this.syncService.InventoryQuantityNorms(request);

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

  @Post('/orders/inventory')
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
  async inventory(
    @Body() payload: SyncInventory,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncInventory(request);
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
    @Body() payload: TransactionRequest,
  ): Promise<ResponsePayload<any>> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncTransaction(request);
  }

  @Post('/receipt')
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
  async syncReceipt(@Body() payload: ReceiptRequest): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncReceipt(request);
  }

  @Post('/item-planning-quantity')
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
  async syncItemPlanningQuantites(
    @Body() payload: ItemPlanningQuantitesRequest,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    return await this.syncService.syncItemPlanningQuantity(request);
  }

  @MessagePattern(MessageSyncKafkaEnum.SYNC_REPORT_DAILY_ITEM_STOCK_TOPIC)
  async readMessage(
    @Payload() body: SyncReportDailyRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request } = body;
    return await this.syncService.saveItemStockWarehouseLocatorByDate(
      request.value,
    );
  }

  @MessagePattern(MessageSyncKafkaEnum.SYNC_REPORT_DAILY_ITEM_PRICE_TOPIC)
  async readMessageSyncItemPrice(
    @Payload() body: SyncReportDailyRequestDto,
  ): Promise<ResponsePayload<any>> {
    const { request } = body;
    return await this.syncService.syncItemPrice(request.value);
  }
}
