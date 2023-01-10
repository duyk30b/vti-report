export interface OrderImportIncompleteModel {
  index: number;
  orderCode: string;
  orderCreatedAt: Date | string;
  departmentReceiptName: string;
  itemCode: string;
  itemName: string;
  unit: string;
  actualQuantity: number | string;
  storageCost: number | string;
  totalPrice: number | string;
  constructionName: string;
  deliverName: string;
}
