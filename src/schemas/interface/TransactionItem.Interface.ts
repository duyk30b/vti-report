import { ActionType } from '@enums/report-type.enum';
import { ReportOrderItemLotInteface } from './report-order-item-lot.interface';

export interface TransactionItemInterface extends ReportOrderItemLotInteface {
  actionType: ActionType;
  orderDetailId: number;
  transactionDate: Date;
}
