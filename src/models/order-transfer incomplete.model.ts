export interface OrderTransferIncompleteModel {
  index: number;
  orderCode: string;
  itemCode: string;
  itemName: string;
  unit: string;
  planQuantity: number | string;
  constructionName: string;
  warehouseImport: string;
}
