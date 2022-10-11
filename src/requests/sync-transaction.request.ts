import { BaseDto } from '@core/dto/base.dto';

export class SyncTransactionRequest extends BaseDto {
  itemId: number;

  lotNumber: string;

  stockQuantity: number;

  warehouseId: number;

  locatorId: number;

  planQuantity: number;

  storageDate: Date;

  orderId: number;

  orderType: number;
}
