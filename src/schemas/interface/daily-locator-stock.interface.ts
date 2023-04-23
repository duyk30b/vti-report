export interface DailyLocatorStockInterface {
  locatorName: string;
  locatorCode: string;
  itemCode: string;
  stockQuantity: number;
  reportDate: Date;
  companyCode: string;
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
