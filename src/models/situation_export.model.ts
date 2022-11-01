export interface DataSituationExportItem {
  itemCode: string;
  itemName: string;
  lot: string;
  accountDebt: number;
  accountHave: number;
  unit: string;
  planQuantity: number;
  exportedQuantity: number;
  locationCode: string;
  storageCost: number;
  totalPrice: number;
}

export interface DataSituationExportOrder {
  orderCode: string;
  orderCreatedAt: Date;
  constructionName: string;
  departmentReceiptName: string;
  explain: string;
  totalPrice: number;
  items: Array<DataSituationExportItem>;
}
export interface DataSituationExportPurpose {
  value: string;
  totalPrice: number;
  orders: Array<DataSituationExportOrder>;
}
export interface TableDataSituationExportPeriod {
  warehouseCode: string;
  totalPrice: number;
  purposes: Array<DataSituationExportPurpose>;
}
