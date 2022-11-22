import { BaseDto } from '@core/dto/base.dto';
import { OrderStatus } from '@enums/order-status.enum';
import { OrderType } from '@enums/order-type.enum';
import { ActionType } from '@enums/report-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionItemInterface } from '@schemas/interface/TransactionItem.Interface';
import { TransactionItem } from '@schemas/transaction-item.schema';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

interface DataCommont {
  code: string;
  name: string;
  address: string;
}
export class SyncTransactionRequest implements TransactionItemInterface {
  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsOptional()
  orderCode: string;

  @ApiProperty()
  @IsOptional()
  ebsNumber: string;

  @ApiProperty()
  @IsOptional()
  qrCode: string;

  @ApiProperty()
  @IsOptional()
  receiptNumber: string;

  @ApiProperty()
  @IsOptional()
  orderDetailId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsOptional()
  orderType: OrderType;

  @ApiProperty()
  @IsOptional()
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
  reason: string;

  explain: string;
  performerName: string;
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
  orderName: string;
  orderCreatedAt: Date;
  planDate: Date;
  completedAt: Date;
  constructionCode: string;
  constructionName: string;
  description: string;
  transactionDate: Date;

  locatorCode: string;
  locatorName: string;
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

export class TransactionRequest extends BaseDto {
  @ApiProperty()
  @IsOptional()
  company: DataCommont;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SyncTransactionRequest)
  data: SyncTransactionRequest[];
}
