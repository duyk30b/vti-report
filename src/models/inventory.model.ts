export interface InventoryModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  stockQuantity: number | string;
  locatorCode: string;
  storageCost: number | string;
  totalPrice: number | string;
}
