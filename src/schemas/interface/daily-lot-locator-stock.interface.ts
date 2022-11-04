export interface DailyItemLotLocatorStockInterface {
  warehouseCode: string;
  lotNumber: string;
  stockQuantity: number;
  reportDate: Date;
  locatorCode: string;
  locatorName: string;
  storageDate: Date;
  account: number;
  companyCode: string;
  itemCode: string;
  itemName: string;
  warehouseName: string;
  minInventoryLimit: number;
  inventoryLimit: number;
  companyName: string;
  unit: string;
  companyAddress: string;
  origin: string;
  storageCost: number;
  note: string;
}
