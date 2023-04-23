export interface InventoryQuantityNormsInterface {
  companyCode: string;

  warehouseCode: string;

  itemCode: string;

  inventoryLimit: number;

  minInventoryLimit: number;

  reorderPoint: number;

  eoq: number;

  itemName: string;

  unit: string;

  warehouseName: string;
}
