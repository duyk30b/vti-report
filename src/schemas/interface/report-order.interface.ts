import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';

export interface ReportOrderInteface {
  orderCode: string;
  orderCreatedAt: Date;

  warehouseCode: string;
  warehouseName: string;

  orderType: OrderType;
  planDate: Date;
  status: OrderStatus;
  completedAt: Date;
  ebsNumber: string;

  companyCode: string;
  companyName: string;
  companyAddress: string;

  constructionCode: string;
  constructionName: string;

  description: string;
  transactionNumberCreated?: string;
}
