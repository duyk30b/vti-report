export interface SituationInventoryPeriodModel {
  index: string;
  itemCode: string;
  itemName: string;
  unit: string;
  lot: string;
  accordingBookQuantity: string;
  accordingBookUnitPrice: string;
  accordingBookTotalPrice: string;
  accordingInventoryQuantity: string;
  accordingInventoryUnitPrice: string;
  accordingInventoryTotalPrice: string;
  differenceWExcessQuantity: string;
  differenceWExcessTotal: string;
  differenceLackQuantity: string;
  differenceLackTotal: string;
  note: string;
  totalPrice: string;
}
