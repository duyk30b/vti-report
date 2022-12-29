export interface OrderImportIncompleteModel {
  index: number;
  orderCode: string;
  orderCreatedAt: Date;
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
