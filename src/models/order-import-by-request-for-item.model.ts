export interface ReportOrderImportByRequestForItemModel {
  index: number;
  orderImportRequireCode: string;
  orderCode: string;
  itemCode: string;
  itemName: string;
  dateImport: Date;
  planQuantity: number;
  actualQuantity: number;
  status: string;
}
