export interface DailyReportStockModel {
  companyCode: string;
  companyName: string;
  warehouseCode: string;
  warehouseName: string;
  locatorCode: string;
  locatorName: string;
  lotNumber: string;
  itemCode: string;
  itemName: string;
  unit: string;
  productionDate: Date;
  storageDate: Date;
  status: number;
  stockQuantity: number;
  price: number;
  totalAmount: number;
  reportDate: Date;
  createdAt: Date;
}
