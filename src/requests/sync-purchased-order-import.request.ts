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
  id: number;

  itemId: number;

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

  exportableQuantity: number;
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
  id: number;

  @ApiProperty()
  @IsOptional()
  purchasedOrderImportId: number;

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
  qcPassQuantity: number;

  @ApiProperty()
  @IsOptional()
  qcRejectQuantity: number;

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
  itemCodeImportActual: string;

  @ApiProperty()
  @IsOptional()
  unit: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  itemCategory: PoImportRelationData;

  @ApiProperty()
  @IsOptional()
  objectCategory: PoImportRelationData;

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

class PurchasedOrderImportWarehouseDetail {
  id: number;

  purchasedOrderImportId: number;

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
  @ApiProperty()
  @IsOptional()
  id: number;

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
  @IsOptional()
  warehouseExportProposals: WarehouseExportProposal;

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
