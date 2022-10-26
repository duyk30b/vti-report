import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ReportOrderItemLotInteface } from '@schemas/interface/report-order-item-lot.interface';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReportOrderItemRequest } from './report-order-items.request';

export class ReportOrderItemLotRequest implements ReportOrderItemLotInteface {
  @ApiProperty()
  @IsOptional()
  @IsString()
  orderNumberEbs: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  explain: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  locationName: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  locationId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  locationCode: string;

  //------
  @ApiProperty()
  @IsOptional()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  performerId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  performerName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  qrCode: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  warehouseTargetId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  warehouseTargetCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  warehouseTargetName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  purpose: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  postCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contract: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  providerId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  providerCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  providerName: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  receiveDepartmentId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  receiveDepartmentCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  receiveDepartmentName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accountId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accountCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accountName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  account: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  accountDebt: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  accountHave: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  proposalExport: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  orderImportRequireCode: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  itemId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  itemName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  receivedQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  storedQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  collectedQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  exportedQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cost: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  orderId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  orderCode: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  orderCreatedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  warehouseId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  warehouseCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  warehouseName: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  planDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  completedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  companyId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  companyAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  constructionId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  constructionCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  constructionName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  ebsId: Date;
}
