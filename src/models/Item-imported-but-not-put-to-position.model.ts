export interface ItemImportedButNotStoreToPositionModel {
  index: number;
  orderCode: string;
  ebsId: string;
  reason: string;
  explain: string;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  planQuantity: number;
  actualQuantity: number;
  remainQuantity: number;
  note: string;
  receiver: string;
}
