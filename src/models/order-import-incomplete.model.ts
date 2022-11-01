export interface OrderImportIncompleteModel {
  index: number;
  orderCode: string;
  orderCreatedAt: Date;
  departmentReceiptName: string;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  construction: string;
  deliver: string;
}
