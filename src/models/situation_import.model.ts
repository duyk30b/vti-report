export interface DataSituationImportItem {
  itemCode: string;
  itemName: string;
  lotNumber: string;
  accountDebt: number;
  accountHave: number;
  unit: string;
  actualQuantity: number;
  locationCode: string;
  unitPrice: number;
  cost: number;
  totalPrice: number;
}

export interface DataSituationImportOrder {
  orderCode: string;
  orderCreatedAt: Date;
  contract: string;
  contructionName: string;
  providerName: string;
  receiveDepartmentName: string;
  explain: string;
  totalPrice: number;
  items: Array<DataSituationImportItem>;
}
export interface DataSituationImportPurpose {
  value: string;
  totalPrice: number;
  orders: Array<DataSituationImportOrder>;
}
export interface TableDataSituationImportPeriod {
  warehouseCode: string;
  totalPrice: number;
  purposes: Array<DataSituationImportPurpose>;
}
