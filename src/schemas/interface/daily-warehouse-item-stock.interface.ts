export interface DailyWarehouseItemStockInterface {
  itemId: number;
  warehouseId: number;
  reportDate: Date;
  stockQuantity: number;
  minInventoryLimit: number;
  inventoryLimit: number;
  storageCost: number;
  companyId: number;
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
