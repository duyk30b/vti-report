export interface DataSituationInventoryItems {
  itemCode: string;
  itemName: string;
  unit: string;
  lot: string;
  totalPlanQuantity: number;
  totalPricePlan: number;
  totalActualQuantity: number;
  totalPriceActual: number;
  cost: number;
  note: string;
}
export interface TableDataSituationInventoryPeriod {
  warehouseCode: string;
  totalPlanQuantity: number;
  totalActualQuantity: number;
  items: Array<DataSituationInventoryItems>;
}
