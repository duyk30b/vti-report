export interface ReportOrderExportByRequestForItemModel {
  index: number;
  itemCode: string;
  itemName: string;
  orderExportRequireCode: string;
  orderCode: string;
  dateExported: Date;
  planQuantity: number;
  exportedQuantity: number;
}
