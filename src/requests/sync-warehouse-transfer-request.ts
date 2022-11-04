import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import {
  Company,
  Construction,
  PoImportRelationData,
  WarehouseExportProposal,
} from './sync-purchased-order-import.request';
import { ItemDetail } from './sync-sale-order-export.request';

class DataResponse {
  id: number;

  name: string;

  code: string;

  accountant: string;
}

class Warehouse {
  id: number;

  name: string;

  code: string;

  factory: Factory;

  manageByLot: number;
}

export class WarehouseTransferResponse {
  id: number;

  name: string;

  code: string;

  status: number;

  type: number;

  createdByUserId: number;

  quantity: Date;

  sourceWarehouse: Warehouse;

  destinationWarehouse: Warehouse;

  items: Item[];

  createdAt: Date;

  updatedAt: Date;

  approvedAt: Date;

  isSameWarehouse: number;

  warehouseTransferReceiveId: number;

  sourceId: number;

  reasonId: number;

  bussinessTypeId: number;

  bussinessType: DataResponse;

  source: DataResponse;

  reason: DataResponse;

  receiver: string;

  explanation: string;
}

export class ItemType {
  id: number;

  name: string;

  code: string;
}

export class ItemUnit {
  id: number;

  name: string;

  code: string;
}

export class ItemGroup {
  id: number;

  name: string;

  code: string;
}

class Factory {
  id: number;

  name: string;

  code: string;
}

class LotNumber {
  quantity: number;

  lotNumber: string;
}

class Item {
  id: number;

  name: string;

  code: string;

  planQuantity: number;

  actualQuantity: number;

  exportedQuantity: number;

  quantity: number;

  itemType: ItemType;

  itemGroup: ItemGroup;

  itemUnit: ItemUnit;

  lots: LotNumber[];
}

class ItemResponse {
  id: number;

  name: string;

  planQuantity: number;

  code: string;

  itemType: ItemType;

  itemGroup: ItemGroup;

  itemUnit: ItemUnit;
}

export class PackageResponse {
  id: number;

  name: string;

  code: string;
}

export class WarehouseTransferDetailResponseDto {
  id: number;

  itemId: number;

  warehouseTransferId: number;

  planQuantity: number;

  actualQuantity: number;

  exportedQuantity: number;

  item: ItemResponse[];
}
class Locator {
  id: number;

  name: string;

  code: string;
}

export class WarehouseTransferDetailLotResponseDto {
  id: number;

  locatorId: number;

  locator: Locator;

  itemId: number;

  warehouseTransferId: number;

  warehouseTransferDetailId: number;

  planQuantity: number;

  actualQuantity: number;

  exportedQuantity: number;

  lotNumber: string;

  mfg: string;

  packageId: number;

  package: PackageResponse;

  item: ItemResponse[];
}

class LotExport {
  id: number;

  mfg: string;

  inventoryQuantity: number;

  actualQuantity: number;

  exportedQuantity: number;

  collectedQuantity: number;

  receivedQuantity: number;

  planQuantity: number;

  lotNumber: string;

  warehouseShelfFloorId: number;

  locationId: number;
}
class ItemExport {
  id: number;

  name: string;

  code: string;
  price: string;

  planQuantity: number;

  actualQuantity: number;

  exportedQuantity: number;

  quantity: number;

  itemUnit: ItemDetail;

  lots: LotExport[];
}
export class WarehouseTransferResponseDto extends WarehouseTransferResponse {
  approvedAt: Date;

  description: string;

  sourceFactory: Factory;

  destinationFactory: Factory;

  items: Item[];

  itemsExport: ItemExport[];

  warehouseTransferDetails: WarehouseTransferDetailResponseDto[];

  warehouseTransferDetailLots: WarehouseTransferDetailLotResponseDto[];

  company: Company;

  warehouseExportProposals: WarehouseExportProposal;

  constructions: Construction;

  departmentReceipt: PoImportRelationData;

  syncCode: string;

  ebsNumber: string;

  qrCode: string;
}

export class SyncWarehouseTransferRequest extends BaseDto {
  actionType: ActionType;
  data: WarehouseTransferResponseDto;
}
