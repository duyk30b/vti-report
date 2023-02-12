export interface DailyItemWarehouseStockPriceInterface {
  itemCode: string;
  warehouseCode: string;
  lotNumber: string;
  quantity: number;
  price: number;
  amount: number;
  reportDate: Date;
  companyCode: string;
}