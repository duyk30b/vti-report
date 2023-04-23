export interface ReportOrderExportByRequestForItemModel {
  index: number;
  itemCode: string;
  itemName: string;
  warehouseExportProposals: string;
  orderCode: string;
  orderCreatedAt: string;
  planQuantity: number | string;
  exportedQuantity: number | string;
  status: string;
}
