export interface ReportInventoryBelowMinimumModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  stockQuantity: number | string;
  minInventoryLimit: number | string;
}
