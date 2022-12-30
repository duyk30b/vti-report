export interface OrderExportIncompleteModel {
  index: number;
  orderCode: string;
  itemCode: string;
  itemName: string;
  unit: string;
  actualQuantity:number |  string;
  constructionName: string;
  receiver: string;
}
