export interface DailyWarehouseItemStockInterface {
  reportDate: Date;
  stockQuantity: number;
  minInventoryLimit: number;
  inventoryLimit: number;
  storageCost: number;
  companyCode: string;
  companyName: string;
  companyAddress: string;
  itemName: string;
  itemCode: string;
  warehouseName: string;
  warehouseCode: string;
  unit: string;
  origin: string;
  note: string;
}
