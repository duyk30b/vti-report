export interface SituationTransferItem {
  storageDate: Date;
  origin: string;
  account: string;
  lotNumber: number;
  unit: string;
  stockQuantity: number;
  locatorCode: string;
  cost: number;
  totalPrice: number;
  sixMonthAgo: number;
  oneYearAgo: number;
  twoYearAgo: number;
  threeYearAgo: number;
  fourYearAgo: number;
  fiveYearAgo: number;
  greaterfiveYear: number;
}
export interface Items {
  itemCode: string;
  itemName: string;
  totalQuantity: number;
  totalPrice: number;
  sixMonthAgo: number;
  oneYearAgo: number;
  twoYearAgo: number;
  threeYearAgo: number;
  fourYearAgo: number;
  fiveYearAgo: number;
  greaterfiveYear: number;
  groupByStorageDate: Array<SituationTransferItem>;
}

export interface TableAgeOfItems {
  warehouseCode: string;
  totalPrice: number;
  sixMonth: number;
  oneYearAgo: number;
  twoYearAgo: number;
  threeYearAgo: number;
  fourYearAgo: number;
  fiveYearAgo: number;
  greaterfiveYear: number;
  items: Array<Items>;
}
