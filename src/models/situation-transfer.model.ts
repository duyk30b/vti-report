export interface SituationTransferItem {
  itemCode: string;
  itemName: string;
  lotNumber: string;
  accountDebt: number;
  accountHave: number;
  unit: string;
  planQuantity: number;
  locationCode: string;
  cost: number;
  totalPrice: number;
}
export interface SituationTransferGroupByPostCode {
  orderCode: string;
  orderCreatedAt: Date;
  warehouseImport: string;
  explain: string;
  totalPrice: number;
  items: Array<SituationTransferItem>;
}

export interface TableDataSituationTransfer {
  warehouseCode: string;
  totalPrice: number;
  orders: Array<SituationTransferGroupByPostCode>;
}
