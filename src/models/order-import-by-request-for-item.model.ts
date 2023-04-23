export interface ReportOrderImportByRequestForItemModel {
  index: number;
  warehouseExportProposals: string;
  orderCode: string;
  itemCode: string;
  itemName: string;
  orderCreatedAt: string;
  planQuantity: number;
  actualQuantity: number;
  status: string;
}
