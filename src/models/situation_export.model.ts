export interface DataSituationExportItem {
  itemCode: string;
  itemName: string;
  lotNumber: string;
  accountDebt: string;
  accountHave: string;
  unit: string;
  planQuantity: number;
  actualQuantity: number;
  locatorCode: string;
  storageCost: number;
  totalPrice: number;
}

export interface DataSituationExportOrder {
  orderCode: string;
  ebsNumber: string;
  orderCreatedAt: string;
  constructionName: string;
  departmentReceiptName: string;
  explain: string;
  totalPrice: number;
  items: Array<DataSituationExportItem>;
}
export interface DataSituationExportReason {
  value: string;
  totalPrice: number;
  orders: Array<DataSituationExportOrder>;
}
export interface TableDataSituationExportPeriod {
  warehouseCode: string;
  totalPrice: number;
  reasons: Array<DataSituationExportReason>;
  reportType?: number;
}
