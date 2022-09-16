export interface ReportInventoryBelowMinimumModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  stockQuantity: number;
  minInventoryLimit: number;
}
