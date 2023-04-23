import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ItemResponseDto {
  price: number;

  itemUnit: string;

  description: string;
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
class Lots {
  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  receivedQuantity: number;

  @ApiProperty()
  @IsOptional()
  storedQuantity: number;

  @ApiProperty()
  @IsOptional()
  collectedQuantity: number;

  @ApiProperty()
  @IsOptional()
  exportedQuantity: number;

  @ApiProperty()
  @IsOptional()
  confirmQuantity: number;

  @ApiProperty()
  @IsNotEmpty()
  lotNumber: string;
}

export class RelationData {
  id: number;

  code: string;

  name: string;

  accountant: string;
}

class ItemDetail {
  name: string;

  code: string;

  price: string;

  itemUnit: string;

  description: string;
}

class OrderDetail {
  @ApiProperty()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  receivedQuantity: number;

  @ApiProperty()
  @IsOptional()
  storedQuantity: number;

  @ApiProperty()
  @IsOptional()
  collectedQuantity: number;

  @ApiProperty()
  @IsOptional()
  exportedQuantity: number;

  @ApiProperty()
  @IsOptional()
  itemDetail: ItemResponseDto;

  @ApiProperty()
  @IsOptional()
  debitAccount: string;

  @ApiProperty()
  @IsOptional()
  creditAccount: string;

  @ApiProperty()
  @IsOptional()
  locator: RelationData;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  lots: Lots[];
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

export class Orders {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @IsOptional()
  deliver: string;

  @ApiProperty()
  @IsOptional()
  explanation: string;

  @ApiProperty()
  @IsOptional()
  receiptDate: Date; //ngày lập phiếu

  @ApiProperty()
  @IsOptional()
  contractNumber: string;

  @ApiProperty()
  @IsOptional()
  departmentReceipt: RelationData;

  @ApiProperty()
  @IsOptional()
  vendor: RelationData;

  @ApiProperty()
  @IsOptional()
  businessType: RelationData;

  @ApiProperty()
  @IsOptional()
  source: RelationData;

  @ApiProperty()
  @IsOptional()
  reason: RelationData;

  @ApiProperty()
  @IsOptional()
  warehouse: RelationData;

  @ApiProperty()
  @IsOptional()
  construction: RelationData;

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
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsOptional()
  ebsNumber: string;

  @ApiProperty()
  @IsOptional()
  qrCode: string;

  @ApiProperty()
  @IsOptional()
  destinationWarehouse: RelationData;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  orderDetail: OrderDetail[];
}

export class SyncOrderRequest extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  data: Orders;
}
