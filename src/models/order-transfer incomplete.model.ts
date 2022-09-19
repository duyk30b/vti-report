export interface OrderTransferIncompleteModel {
  index: number;
  orderId: number;
  itemCode: string;
  itemName: string;
  unit: string;
  planQuantity: number;
  construction: string;
  performerName: string;
}
