export interface OrderImportIncompleteModel {
  index: number;
  orderCode: string;
  orderCreatedAt: Date;
  receiveDepartmentName: string;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  construction: string;
  deliver: string;
}
