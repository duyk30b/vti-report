import { BaseDto } from '@core/dto/base.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class SyncReceiptRequest {
  @ApiProperty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  contractNumber: string;

  @ApiProperty()
  @IsOptional()
  receiptNumber: string;

  @ApiProperty()
  @IsOptional()
  status: number;

  @ApiProperty()
  @IsOptional()
  companyCode: string;

  @ApiProperty()
  @IsOptional()
  itemCode: string;

  @ApiProperty()
  @IsOptional()
  itemName: string;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  orderQuantity: number;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  amount: number;

  @ApiProperty()
  @IsOptional()
  receiptDate: Date;
}

class DataSyncReceipt {
  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SyncReceiptRequest)
  dataSync: SyncReceiptRequest[];
}

export class ReceiptRequest extends BaseDto {
  @ApiProperty()
  @IsNotEmpty()
  data: DataSyncReceipt;
}
