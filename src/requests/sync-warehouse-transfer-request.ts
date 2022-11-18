import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
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
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsOptional()
  mfg: string;

  @ApiProperty()
  @IsOptional()
  inventoryQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  exportedQuantity: number;

  @ApiProperty()
  @IsOptional()
  collectedQuantity: number;

  @ApiProperty()
  @IsOptional()
  receivedQuantity: number;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  warehouseShelfFloorId: number;

  @ApiProperty()
  @IsOptional()
  locationId: number;
}
class ItemExport {
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  price: string;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  exportedQuantity: number;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  itemUnit: ItemDetail;

  @ApiProperty()
  @IsOptional()
  lots: LotExport[];
}
export class WarehouseTransferResponseDto extends WarehouseTransferResponse {
  @ApiProperty()
  @IsOptional()
  approvedAt: Date;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  sourceFactory: Factory;

  @ApiProperty()
  @IsOptional()
  destinationFactory: Factory;

  @ApiProperty()
  @IsOptional()
  items: Item[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @Type(() => ItemExport)
  @ValidateNested({ each: true })
  itemsExport: ItemExport[];

  @ApiProperty()
  @IsOptional()
  warehouseTransferDetails: WarehouseTransferDetailResponseDto[];

  @ApiProperty()
  @IsOptional()
  warehouseTransferDetailLots: WarehouseTransferDetailLotResponseDto[];

  @ApiProperty()
  @IsOptional()
  company: Company;

  @ApiProperty()
  @IsOptional()
  warehouseExportProposals: WarehouseExportProposal;

  @ApiProperty()
  @IsOptional()
  constructions: Construction;

  @ApiProperty()
  @IsOptional()
  departmentReceipt: PoImportRelationData;

  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsOptional()
  ebsNumber: string;

  @ApiProperty()
  @IsOptional()
  qrCode: string;
}

export class SyncWarehouseTransferRequest extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WarehouseTransferResponseDto)
  data: WarehouseTransferResponseDto;
}
