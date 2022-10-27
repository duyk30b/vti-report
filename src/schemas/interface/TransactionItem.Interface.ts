import { OrderType } from '@enums/order-type.enum';

export interface TransactionItemInterface {
  itemId: number;

  lotNumber: string;

  stockQuantity: number;

  warehouseId: number;

  locatorId: number;

  planQuantity: number;

  storageDate: Date;

  orderId: number;

  orderType: OrderType;
}
