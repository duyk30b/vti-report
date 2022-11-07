export interface InventoryModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  stockQuantity: number;
  locatorCode: string;
  storageCost: number;
  totalPrice: number;
}
