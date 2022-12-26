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

  createdAt: Date;

  receiptDate: Date;

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

class ItemResponse {
  id: number;

  name: string;

  planQuantity: number;

  code: string;

  itemType: any;

  itemGroup: any;

  itemUnit: any;
}

class LotExport {
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
}
class WarehouseTransferDetail {
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
  debitAccount: any;

  @ApiProperty()
  @IsOptional()
  creditAccount: string;


  @ApiProperty()
  @IsOptional()
  item: ItemResponse;

  @ApiProperty()
  @IsOptional()
  lots: LotExport[];
}
export class WarehouseTransferResponseDto extends WarehouseTransferResponse {
  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @Type(() => WarehouseTransferDetail)
  @ValidateNested({ each: true })
  warehouseTransferDetails: WarehouseTransferDetail[];

  @ApiProperty()
  @IsOptional()
  company: Company;

  @ApiProperty()
  @IsOptional()
  warehouseExportProposals: WarehouseExportProposal;

  @ApiProperty()
  @IsOptional()
  construction: Construction;

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
