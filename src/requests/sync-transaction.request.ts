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
export class SyncTransactionRequest {
  @ApiProperty()
  @IsOptional()
  transactionDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsOptional()
  orderCode: string;

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
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

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
  itemUnitName: string;

  @ApiProperty()
  @IsOptional()
  locator: DataCommont;
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
