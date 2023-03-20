import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';

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
  @ApiProperty()
  @IsOptional()
  itemId: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  storedQuantity: number;

  @ApiProperty()
  @IsOptional()
  exportableQuantity: number;
  
  @ApiProperty()
  @IsOptional()
  amount: number;
}

export class PoImportRelationData {
  id: number;

  code: string;

  name: string;

  accountant: string;
}

class PurchasedOrderImportDetail {
  @ApiProperty()
  @IsOptional()
  itemId: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  exportableQuantity: number;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  confirmQuantity: number;

  @ApiProperty()
  @IsOptional()
  receivedQuantity: number;

  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  amount: number;

  @ApiProperty()
  @IsOptional()
  debitAccount: any;

  @ApiProperty()
  @IsOptional()
  creditAccount: string;

  @ApiProperty()
  @IsOptional()
  item: ItemResponseDto;

  @ApiProperty()
  @IsOptional()
  lots: PurchasedOrderImportWarehouseLot[];
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
  name: string;

  code: string;

  address: string;
}

export class WarehouseExportProposal {
  @ApiProperty()
  @IsOptional()
  code: string;
}
export class Construction {
  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  name: string;
}

export class PurchasedOrderImportRequestDto {
  @ApiProperty()
  @IsOptional()
  companyCode: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  status: OrderStatus;

  @ApiProperty()
  @IsOptional()
  deliver: string;

  @ApiProperty()
  @IsOptional()
  explanation: string;

  @ApiProperty()
  @IsOptional()
  receiptDate: Date;

  @ApiProperty()
  @IsOptional()
  contractNumber: string;

  @ApiProperty()
  @IsOptional()
  receiptNumber: string; //Phiếu yêu cầu nhập kho

  @ApiProperty()
  @IsOptional()
  departmentReceipt: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  vendor: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  source: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  reason: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  warehouse: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  construction: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  warehouseExportProposal: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  purchasedOrderImportDetails: PurchasedOrderImportDetail[];

  @ApiProperty()
  @IsOptional()
  company: Company;

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

export class SyncPurchasedOrderRequest extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PurchasedOrderImportRequestDto)
  data: PurchasedOrderImportRequestDto;
}
