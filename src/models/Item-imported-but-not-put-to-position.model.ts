export interface ItemImportedButNotStoreToPositionModel {
  index: number;
  orderCode: string;
  ebsNumber: string;
  reason: string;
  explain: string;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  recievedQuantity: number;
  actualQuantity: number;
  remainQuantity: number;
  note: string;
  performerName: string;
}
