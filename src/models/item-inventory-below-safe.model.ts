export interface ReportInventoryBelowSafeModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  inventoryLimit: number | string;
  stockQuantity: number | string;
}
