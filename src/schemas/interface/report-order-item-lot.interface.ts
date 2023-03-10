import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ReportOrderItemInteface } from './report-order-item.interface';

export interface ReportOrderItemLotInteface extends ReportOrderItemInteface {
  lotNumber: string;
  reason: string;
  explain: string;
  note: string;
  locatorName: string;
  locatorCode: string;
  transactionNumberCreated?: string;
}
