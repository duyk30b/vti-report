import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class ItemResponseDto {
  itemId: number;

  name: string;

  code: string;

  price: number;

  itemUnit: string;

  description: string;

  quantity: number;

  itemDetails: any;

  details: any;
}

export class WarehouseResponseDto {
  id: number;

  name: string;

  code: string;

  description: string;

  quantity: number;

  factoryId: number;

  manageByLot: boolean;
}
class PurchasedOrderImportWarehouseLot {
  id: number;

  itemId: number;

  warehouseId: number;

  purchasedOrderImportWarehouseDetailId: number;

  purchasedOrderImportId: number;

  actualQuantity: number;

  quantity: number;

  qcRejectQuantity: number;

  qcPassQuantity: number;

  isEven: boolean;

  lotNumber: string;

  item: ItemResponseDto;

  storedQuantity: number;
}

export class PoImportRelationData {
  id: number;

  code: string;

  name: string;

  accountant: string;
}

class PurchasedOrderImportDetail {
  id: number;

  purchasedOrderImportId: number;

  itemId: number;

  actualQuantity: number;

  exportableQuantity: number;

  quantity: number;

  qcPassQuantity: number;

  qcRejectQuantity: number;

  confirmQuantity: number;

  receivedQuantity: number;

  lotNumber: string;

  itemCode: string;

  itemCodeImportActual: string;

  unit: PoImportRelationData;

  itemCategory: PoImportRelationData;

  objectCategory: PoImportRelationData;

  price: number;

  amount: number;

  debitAccount: any;

  creditAccount: string;

  item: ItemResponseDto;

  lots: PurchasedOrderImportWarehouseLot[];
}

class PurchasedOrderImportWarehouseDetail {
  id: number;

  purchasedOrderImportId: number;

  warehouseId: number;

  itemId: number;

  actualQuantity: number;

  quantity: number;

  confirmQuantity: number;

  qcRejectQuantity: number;

  qcPassQuantity: number;

  errorQuantity: number;

  qcCheck: number;

  qcCriteriaId: number;

  item: ItemResponseDto;

  warehouse: WarehouseResponseDto;

  purchasedOrderImportWarehouseLots: PurchasedOrderImportWarehouseLot[];
}

export class ManufacturingOrder {
  id: number;

  code: number;

  name: string;

  factoryId: number;

  saleOrderId: number;

  planFrom: Date;

  planTo: Date;

  status: string;

  description: string;

  createdAt: Date;

  updatedAt: Date;
}

export class PurchasedOrderImportReceive {
  referenceDoc: string;

  postedAt: Date;

  note: string;
}

export class AttributeResponse {
  id: number;

  code: string;

  bussinessTypeId: number;

  fieldName: string;

  ebsLabel: string;

  type: number;

  columnName: string;

  tableName: string;

  value: any;

  required: boolean;
}

export class Company {
  id: number;

  name: string;

  code: string;

  address: string;
}

export class WarehouseExportProposal {
  id: number;
  code: string;
}
export class Construction {
  id: number;
  code: string;
  name: string;
}

export class PurchasedOrderImportRequestDto {
  id: number;

  companyId: number;

  name: string;

  code: string;

  status: OrderStatus;

  deliver: string;

  explanation: string;

  receiptDate: Date;

  contractNumber: string;

  receiptNumber: string;

  departmentReceipt: PoImportRelationData;

  vendor: PoImportRelationData;

  businessType: PoImportRelationData;

  source: PoImportRelationData;

  reason: PoImportRelationData;

  warehouse: PoImportRelationData;

  construction: PoImportRelationData;

  constructionCategory: PoImportRelationData;

  warehouseExportProposal: PoImportRelationData;

  purchasedOrderImportDetails: PurchasedOrderImportDetail[];

  purchasedOrderImportWarehouseLots: PurchasedOrderImportWarehouseLot[];

  purchasedOrderImportWarehouseDetails: PurchasedOrderImportWarehouseDetail[];

  attributes: AttributeResponse[];

  company: Company;

  warehouseExportProposals: WarehouseExportProposal;

  constructions: Construction[];

  syncCode: string;

  ebsNumber: string;

  qrCode: string;
}

export class SyncOrderRequest extends BaseDto {
  actionType: ActionType;
  data: PurchasedOrderImportRequestDto;
}
