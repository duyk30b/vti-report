export interface ItemImportedButNotStoreToPositionModel {
  index: number;
  orderId: number;
  orderCode: string;
  reason: string;
  explain: string;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  actualQuantity: number;
  receivedQuantity: number;
  receiveQuantity: number;
  note: string;
  receiver: string;
}
