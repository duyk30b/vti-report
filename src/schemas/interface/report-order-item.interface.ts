import { ReportOrderInteface } from './report-order.interface';

export interface ReportOrderItemInteface extends ReportOrderInteface {
  unit: string;
  performerName: string;
  qrCode: string;
  warehouseTargetCode: string;
  warehouseTargetName: string;
  reason: string;
  contract: string;
  providerCode: string;
  providerName: string;
  departmentReceiptCode: string;
  departmentReceiptName: string;
  account: string;
  accountDebt: string;
  accountHave: string;
  warehouseExportProposals: string; // Giay de nghi xuat vat tu
  itemName: string;
  itemCode: string;
  planQuantity: number;
  actualQuantity: number;
  receivedQuantity: number;
  storedQuantity: number;
  collectedQuantity: number;
  exportedQuantity: number;
  storageCost: number;
  receiptNumber: string;
}
