import { BaseDto } from '@core/dto/base.dto';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionItemInterface } from '@schemas/interface/TransactionItem.Interface';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

interface DataCommont {
  code: string;
  name: string;
  address: string;
}
export class SyncTransactionRequest
  extends BaseDto
  implements TransactionItemInterface
{
  reason: string;
  explain: string;
  performerName: string;
  qrCode: string;
  warehouseTargetCode: string;
  warehouseTargetName: string;
  contract: string;
  providerCode: string;
  providerName: string;
  departmentReceiptCode: string;
  departmentReceiptName: string;
  accountDebt: string;
  accountHave: string;
  warehouseExportProposals: string;
  orderCode: string;
  orderCreatedAt: Date;
  planDate: Date;
  completedAt: Date;
  ebsNumber: string;
  constructionCode: string;
  constructionName: string;
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsNotEmpty()
  orderType: OrderType;

  @ApiProperty()
  @IsNotEmpty()
  status: OrderStatus;

  @ApiProperty()
  @IsOptional()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  confirmQuantity: number;

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
  warehouse: DataCommont;

  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  itemName: string;

  @ApiProperty()
  @IsOptional()
  locator: DataCommont;

  @ApiProperty()
  @IsOptional()
  company: DataCommont;

  @ApiProperty()
  @IsOptional()
  locatorCode: string;

  @ApiProperty()
  @IsOptional()
  locatorName: string;

  @ApiProperty()
  @IsOptional()
  transactionDate: Date;

  account: string;
  unit: string;
  origin: string;
  storageCost: number;
  note: string;
  reportDate: Date;
  storageDate: Date;
  minInventoryLimit: number;
  inventoryLimit: number;
  companyName: string;
  companyCode: string;
  companyAddress: string;
  warehouseCode: string;
  warehouseName: string;
}
