import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import {
  Company,
  Construction,
  WarehouseExportProposal,
} from './sync-purchased-order-import.request';

export class WarehouseResponseDto {
  id: number;

  name: string;

  code: string;

  description: string;

  quantity: number;

  factoryId: number;

  manageByLot: boolean;
}

export class ItemResponseDto {
  itemId: number;

  name: string;

  code: string;

  price: number;

  itemUnit: string;

  description: string;

  quantity: number;

  itemDetails: any;
}

export class SoExportRelationData {
  id: number;

  code: string;

  name: string;

  accountant: string;
}

class SaleOrderExportWarehouseLot {
  id: number;

  saleOrderExportId: number;

  saleOrderExportWarehouseDetailId: number;

  itemId: number;

  warehouseId: number;

  lotNumber: string;

  quantity: number;

  collectedQuantity: number;

  actualQuantity: number;

  item: ItemResponseDto;

  warehouse: WarehouseResponseDto;
}

class SaleOrderExportDetail {
  id: number;

  saleOrderExportId: number;

  itemId: number;

  itemCode: string;

  unitId: number;

  quantity: number;

  debitAccount: string;

  creditAccount: string;

  item: ItemResponseDto;
}

class SaleOrderExportWarehouseDetail {
  id: number;

  saleOrderExportId: number;

  saleOrderExportDetailId: number;

  warehouseId: number;

  itemId: number;

  actualQuantity: number;

  collectedQuantity: number;

  quantity: number;

  lots: string;

  warehouse: WarehouseResponseDto;

  item: ItemResponseDto;
}

class SaleOrderExportWarehouse {
  id: number;

  name: string;

  code: string;

  description: string;

  factoryId: number;
}

class BusinessTypeAttributes {
  id: number;

  code: string;

  fieldName: string;

  type: number;

  columnName: string;

  tableName: string;

  required: number;

  value: any;
}

export class itemWarehouseSources {
  warehouseId: number;
  sourceId: number;
  name: string;
  code: string;
  accountIdentifier: string;
}
export class LotItems {
  lotNumber: string;

  mfg: string;

  planQuantity: number;

  confirmedQuantity: number;

  actualQuantity: number;
}

export class ItemDetail {
  name: string;
  code: string;
  price: string;
  itemUnit: string;
  description: string;
  details: [];
  itemWarehouseSources: itemWarehouseSources[];
}
class ItemImoRespone {
  id: number;

  code: string;

  name: string;

  itemUnit: string;

  quantity: number;

  confirmedQuantity: number;

  planQuantity: number;

  actualQuantity: number;

  debitAccount: string;

  creditAccount: string;

  item: ItemDetail;

  lots: LotItems[];
}

export class SaleOrderExportResponseDto extends BaseDto {
  company: Company;

  id: number;

  code: string;

  warehouseId: number;

  receiptDate: Date;

  status: number;

  receiver: string;

  departmentReceiptId: number;

  businessTypeId: number;

  explanation: string;

  syncCode: string;

  receiptNumber: string;

  createdAt: Date;

  updatedAt: Date;

  saleOrderExportDetails: SaleOrderExportDetail[];

  saleOrderExportWarehouseLots: SaleOrderExportWarehouseLot[];

  saleOrderExportWarehouseDetails: SaleOrderExportWarehouseDetail[];

  warehouse: SaleOrderExportWarehouse;

  source: SoExportRelationData;

  reason: SoExportRelationData;

  departmentReceipt: SoExportRelationData;

  businessType: SoExportRelationData;

  attributes: BusinessTypeAttributes[];

  createdByUser: any;

  updatedBy: any;

  itemsSync: ItemImoRespone[];

  warehouseExportProposals: WarehouseExportProposal;

  constructions: Construction;

  ebsNumber: string;

  qrCode: string;
}

export class SyncSaleOrderExportRequest extends BaseDto {
  actionType: ActionType;
  data: SaleOrderExportResponseDto;
}
