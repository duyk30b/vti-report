import { ReportOrderInteface } from './report-order.interface';

export interface ReportOrderItemInteface extends ReportOrderInteface {
  unit: string;
  performerId: number;
  performerName: string;
  qrCode: string;
  warehouseTargetId: number;
  warehouseTargetCode: string;
  warehouseTargetName: string;
  purpose: string;
  contract: string;
  providerId: number;
  providerCode: string;
  providerName: string;
  departmentReceiptId: number;
  departmentReceiptCode: string;
  departmentReceiptName: string;
  account: number;
  accountDebt: number;
  accountHave: number;
  warehouseExportProposals: string; // Giay de nghi xuat vat tu
  itemId: number;
  itemName: string;
  itemCode: string;
  planQuantity: number;
  actualQuantity: number;
  receivedQuantity: number;
  storedQuantity: number;
  collectedQuantity: number;
  exportedQuantity: number;
  storageCost: number;
}
