export interface OrderTransferIncompleteModel {
  index: number;
  orderCode: string;
  itemCode: string;
  itemName: string;
  unit: string;
  actualQuantity: number | string;
  constructionName: string;
  warehouseImport: string;
}
