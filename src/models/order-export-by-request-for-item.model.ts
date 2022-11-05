export interface ReportOrderExportByRequestForItemModel {
  index: number;
  itemCode: string;
  itemName: string;
  warehouseExportProposals: string;
  orderCode: string;
  orderCreatedAt: string;
  planQuantity: number;
  exportedQuantity: number;
}
