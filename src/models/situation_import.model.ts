export interface DataSituationImportItem {
  itemCode: string;
  itemName: string;
  lotNumber: string;
  accountDebt: string;
  accountHave: string;
  unit: string;
  actualQuantity: number;
  locatorCode: string;
  unitPrice: number;
  storageCost: number;
  totalPrice: number;
}

export interface DataSituationImportOrder {
  orderCode: string;
  ebsNumber: string;
  orderCreatedAt: Date;
  contract: string;
  constructionName: string;
  providerName: string;
  departmentReceiptName: string;
  explain: string;
  totalPrice: number;
  items: Array<DataSituationImportItem>;
}
export interface DataSituationImportReason {
  value: string;
  totalPrice: number;
  orders: Array<DataSituationImportOrder>;
}
export interface TableDataSituationImportPeriod {
  warehouseCode: string;
  totalPrice: number;
  reasons: Array<DataSituationImportReason>;
  reportType?: number;
}
