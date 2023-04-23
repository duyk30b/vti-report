export class SyncDailyItemLotStockLocatorRequestDto {
  reportDate: Date;

  lotNumber: string;

  locatorName: string;

  locatorCode: string;

  itemCode: string;

  itemName: string;

  stockQuantity: number;

  account: string;

  companyCode: string;

  storageCost: string;

  companyName: string;

  warehouseName: string;

  warehouseCode: string;

  unit: string;

  origin: string;

  note: string;

  minInventoryLimit: number;

  inventoryLimit: number;

  companyAddress: string;

  storageDate: Date;
}

export class SyncDailyItemStockLocatorRequestDto {
  reportDate: Date;

  locatorName: string;

  locatorCode: string;

  itemCode: string;

  itemName: string;

  stockQuantity: number;

  companyCode: string;

  storageCost: string;

  companyName: string;

  warehouseName: string;

  warehouseCode: string;

  unit: string;

  origin: string;

  note: string;

  minInventoryLimit: number;

  inventoryLimit: number;

  companyAddress: string;
}

export class SyncDailyItemStockWarehouseRequestDto {
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

export class SyncDailyStockRequestDto {
  itemStockLocatorDaily: SyncDailyItemStockLocatorRequestDto[];

  itemStockWarehouseDaily: SyncDailyItemStockWarehouseRequestDto[];

  itemLotStockLocatorDaily: SyncDailyItemLotStockLocatorRequestDto[];
}
