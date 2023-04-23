export interface DataSituationInventoryItems {
  itemCode: string;
  itemName: string;
  unit: string;
  lotNumber: string;
  totalPlanQuantity: number;
  totalPricePlan: number;
  totalActualQuantity: number;
  totalPriceActual: number;
  storageCost: number;
  note: string;
}
export interface TableDataSituationInventoryPeriod {
  warehouseCode: string;
  totalPlanQuantity: number;
  totalActualQuantity: number;
  items: Array<DataSituationInventoryItems>;
}
