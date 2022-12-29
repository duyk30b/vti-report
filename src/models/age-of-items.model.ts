export interface SituationTransferItem {
  storageDate: string;
  origin: string;
  account: string;
  lotNumber: string;
  unit: string;
  stockQuantity: number;
  locatorCode: string;
  storageCost: number;
  totalPrice: string;
  sixMonthAgo: string;
  oneYearAgo: string;
  twoYearAgo: string;
  threeYearAgo: string;
  fourYearAgo: string;
  fiveYearAgo: string;
  greaterfiveYear: string;
}
export interface Items {
  itemCode: string;
  itemName: string;
  totalQuantity: number | string;
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
