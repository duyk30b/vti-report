import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import {
  Company,
  Construction,
  WarehouseExportProposal,
} from './sync-purchased-order-import.request';
import {
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

  amount: number;

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

class SaleOrderExportDetail {
  @ApiProperty()
  @IsOptional()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  quantity: number;

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
  item: ItemResponseDto;

  @ApiProperty()
  @IsOptional()
  lots: LotItems[];
}

class Warehouse {
  name: string;

  code: string;
}
export class LotItems {
  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  mfg: string;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  confirmedQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  amount: number;
}

export class ItemDetail {
  name: string;
  code: string;
  price: string;
  itemUnit: string;
  description: string;
  details: [];
}

export class SaleOrderExportResponseDto extends BaseDto {
  @ApiProperty()
  @IsOptional()
  company: Company;

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
  explanation: string;

  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsOptional()
  receiptNumber: string;

  @ApiProperty()
  @IsOptional()
  saleOrderExportDetails: SaleOrderExportDetail[];

  @ApiProperty()
  @IsOptional()
  warehouse: Warehouse;

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
  warehouseExportProposals: WarehouseExportProposal;

  @ApiProperty()
  @IsOptional()
  construction: Construction;

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
