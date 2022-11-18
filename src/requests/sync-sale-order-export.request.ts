import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import {
  Company,
  Construction,
  WarehouseExportProposal,
} from './sync-purchased-order-import.request';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

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
  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  itemUnit: string;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  confirmedQuantity: number;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  debitAccount: string;

  @ApiProperty()
  @IsOptional()
  creditAccount: string;

  @ApiProperty()
  @IsOptional()
  item: ItemDetail;

  @ApiProperty()
  @IsOptional()
  lots: LotItems[];
}

export class SaleOrderExportResponseDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  company: Company;

  @ApiProperty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  receiptDate: Date;

  @ApiProperty()
  @IsOptional()
  status: number;

  @ApiProperty()
  @IsOptional()
  receiver: string;

  @ApiProperty()
  @IsOptional()
  departmentReceiptId: number;

  @ApiProperty()
  @IsOptional()
  businessTypeId: number;

  @ApiProperty()
  @IsOptional()
  explanation: string;

  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsOptional()
  receiptNumber: string;

  @ApiProperty()
  @IsOptional()
  createdAt: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty()
  @IsOptional()
  saleOrderExportDetails: SaleOrderExportDetail[];

  @ApiProperty()
  @IsOptional()
  saleOrderExportWarehouseLots: SaleOrderExportWarehouseLot[];

  @ApiProperty()
  @IsOptional()
  saleOrderExportWarehouseDetails: SaleOrderExportWarehouseDetail[];

  @ApiProperty()
  @IsOptional()
  warehouse: SaleOrderExportWarehouse;

  @ApiProperty()
  @IsOptional()
  source: SoExportRelationData;

  @ApiProperty()
  @IsOptional()
  reason: SoExportRelationData;

  @ApiProperty()
  @IsOptional()
  departmentReceipt: SoExportRelationData;

  @ApiProperty()
  @IsOptional()
  businessType: SoExportRelationData;

  @ApiProperty()
  @IsOptional()
  attributes: BusinessTypeAttributes[];

  @ApiProperty()
  @IsOptional()
  createdByUser: any;

  @ApiProperty()
  @IsOptional()
  updatedBy: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  itemsSync: ItemImoRespone[];

  @ApiProperty()
  @IsOptional()
  warehouseExportProposals: WarehouseExportProposal;

  @ApiProperty()
  @IsOptional()
  constructions: Construction;

  @ApiProperty()
  @IsOptional()
  ebsNumber: string;

  @ApiProperty()
  @IsOptional()
  qrCode: string;
}

export class SyncSaleOrderExportRequest extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaleOrderExportResponseDto)
  data: SaleOrderExportResponseDto;
}
