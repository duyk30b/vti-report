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
  postCode: string;
  contract: string;
  providerId: number;
  providerCode: string;
  providerName: string;
  receiveDepartmentId: number;
  receiveDepartmentCode: string;
  receiveDepartmentName: string;
  account: number;
  accountDebt: number;
  accountHave: number;
  proposalExport: string; // Giay de nghi xuat vat tu
  orderImportRequireCode: string; //Giay de nghi nhap vat tu
  itemId: number;
  itemName: string;
  itemCode: string;
  planQuantity: number;
  actualQuantity: number;
  receivedQuantity: number;
  storedQuantity: number;
  collectedQuantity: number;
  exportedQuantity: number;
  cost: number;
}
