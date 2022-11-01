import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';

export interface ReportOrderInteface {
  orderId: number;
  orderCode: string;
  orderCreatedAt: Date;
  warehouseId: number;
  warehouseCode: string;
  warehouseName: string;
  orderType: OrderType;
  planDate: Date;
  status: OrderStatus;
  completedAt: Date;
  companyId: number;
  ebsId: Date;
  ebsNumber: string;
  companyName: string;
  companyAddress: string;
  constructionId: number;
  constructionCode: string;
  constructionName: string;
  description: string;
}
