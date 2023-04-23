import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportOrderItemInteface } from './report-order-item.interface';
import { Expose } from 'class-transformer';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class source {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  code: string;
}

export interface ReportOrderItemLotInteface extends ReportOrderItemInteface {
  baseId?: number;
  lotNumberOld?: string;
  lotNumber: string;
  reason: string;
  explain: string;
  note: string;
  locatorName: string;
  locatorCode: string;
  transactionNumberCreated?: string;
  source: source;
}
