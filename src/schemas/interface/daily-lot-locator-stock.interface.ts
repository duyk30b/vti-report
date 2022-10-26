export interface DailyItemLotLocatorStockInterface {
  warehouseId: number;
  locatorId: number;
  warehouseCode: string;
  itemId: number;
  lotNumber: string;
  stockQuantity: number;
  reportDate: Date;
  locatorCode: string;
  locatorName: string;
  storageDate: Date;
  account: string;
  companyId: number;
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
