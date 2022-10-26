export interface DailyLocatorStockInterface {
  warehouseId: number;
  locatorId: number;
  locatorName: string;
  locatorCode: string;
  itemId: number;
  itemCode: string;
  stockQuantity: number;
  reportDate: Date;
  companyId: number;
  storageCost: number;
  itemName: string;
  warehouseName: string;
  warehouseCode: string;
  companyName: string;
  unit: string;
  minInventoryLimit: number;
  inventoryLimit: number;
  companyAddress: string;
  origin: string;
  note: string;
}
