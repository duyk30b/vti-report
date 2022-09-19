export interface ItemInventoryModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  lot: string;
  unitPrice: number;
  inventoryBeginningQuantity: number;
  inventoryBeginningTotal: number;
  importInPeriodQuantity: number;
  importInPeriodTotal: number;
  exportInPeriodQuantity: number;
  exportInPeriodTotal: number;
  inventoryEndQuantity: number;
  inventoryEndTotal: number;
  note: string;
}
