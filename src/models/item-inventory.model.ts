export interface ItemInventoryModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  storageCost: number;
  stockStart: number;
  totalStockStart: number;
  importIn: number;
  totalImportIn: number;
  exportIn: number;
  totalExportIn: number;
  stockEnd: number;
  totalStockEnd: number;
  note: string;
}
