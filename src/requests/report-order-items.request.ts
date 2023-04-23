import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ReportOrderItemInteface } from '@schemas/interface/report-order-item.interface';
import { ReportOrder } from '@schemas/report-order.schema';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ReportOrderItemLotRequest } from './report-order-item-lot.request';

export class ReportOrderItemRequest implements ReportOrderItemInteface {
  @ApiProperty()
  @IsOptional()
  @IsString()
  receiptNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  departmentReceiptCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ebsNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  unit: string;

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
  @IsString()
  warehouseTargetCode: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  warehouseTargetName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reason: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contract: string;

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
  @IsString()
  departmentReceiptName: string;

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
  @IsNumber()
  account: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  accountDebt: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  accountHave: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  warehouseExportProposals: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @ApiProperty()
  @IsNotEmpty()
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
  storageCost: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  amount: number;

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
  @IsString()
  companyCode: string;

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
  @IsString()
  transactionNumberCreated: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReportOrderItemLotRequest)
  reportOrderItemLots: ReportOrderItemLotRequest[];
}
