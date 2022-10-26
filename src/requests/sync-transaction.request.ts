import { BaseDto } from '@core/dto/base.dto';
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

export class SyncTransactionRequest
  extends BaseDto
  implements TransactionItemInterface
{
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lotNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  warehouseId: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  stockQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  locatorId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  storageDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  orderId: number;
}
