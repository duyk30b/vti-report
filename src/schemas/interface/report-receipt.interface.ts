export interface ReportReceiptInteface {
  code: string;
  contractNumber: string;
  receiptNumber: string;
  status: number;
  companyCode: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  orderQuantity: number;
  price: number;
  amount: number;
  receiptDate: Date;
}
