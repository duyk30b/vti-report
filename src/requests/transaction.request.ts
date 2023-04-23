import { BaseDto } from '@core/dto/base.dto';

export class SyncTransactionRequest extends BaseDto {
  lotNumber: string;

  stockQuantity: number;

  planQuantity: number;

  storageDate: Date;

  orderType: number;
}
