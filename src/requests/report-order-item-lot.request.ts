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

export class ReportOrderItemLotRequest implements ReportOrderItemLotInteface {
  @ApiProperty()
  @IsOptional()
  @IsString()
  ebsNumber: string;

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
  locatorName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  locatorCode: string;

  //------
  @ApiProperty()
  @IsOptional()
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
  departmentReceiptCode: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  departmentReceiptName: string;

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
  storageCost: number;

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
}
