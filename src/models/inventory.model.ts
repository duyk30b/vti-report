export interface InventoryModel {
  index: number;
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  manufacturingCountry: string;
  locatorCode: string;
  stockQuantity: number | string;
  storageCost: number | string;
  totalPrice: number | string;
}
