export interface OrderImportIncompleteModel {
  index: number;
  orderCode: string;
  orderCreatedAt: Date;
  departmentReceiptName: string;
  itemCode: string;
  itemName: string;
  unit: string;
  actualQuantity: number;
  storageCost: number;
  totalPrice: number;
  constructionName: string;
  deliverName: string;
}
