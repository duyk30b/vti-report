export interface ItemImportedButNotStoreToPositionModel {
  index: number;
  orderCode: string;
  reason: string;
  explain: string;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  recievedQuantity: number | string;
  actualQuantity: number | string;
  remainQuantity: number | string;
  performerName: string;
}
