import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@core/dto/base.dto';
import { ActionType } from '@enums/export-type.enum';
import {
  Company,
  Construction,
  WarehouseExportProposal,
} from './sync-purchased-order-import.request';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { INVENTORY_ADJUSTMENT_TYPE } from '@constant/common';
import { OrderType } from '@enums/order-type.enum';

export class RelationData {
  code: string;

  name: string;

  accountant?: string;
}

class Items {
  @ApiProperty()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;

  @ApiProperty()
  @IsOptional()
  debitAccount: string;

  @ApiProperty()
  @IsOptional()
  creditAccount: string;

  @ApiProperty()
  @IsOptional()
  price: number;
  
  @ApiProperty()
  @IsOptional()
  unit: string;

  @ApiProperty()
  @IsOptional()
  lots: LotItems[];
}

class Warehouse {
  name: string;

  code: string;
}

export class LotItems {
  @ApiProperty()
  @IsOptional()
  lotNumber: string;

  @ApiProperty()
  @IsOptional()
  planQuantity: number;

  @ApiProperty()
  @IsOptional()
  actualQuantity: number;
}


export class InventoryAdjustment  {
  @ApiProperty()
  @IsNotEmpty()
  syncCode: string;

  //có sync code r thì không cần cái này
  @ApiProperty()
  @IsOptional()
  company: Company;

  @ApiProperty()
  @IsOptional()
  code: string;

  //ngày tạo phiếu
  @ApiProperty()
  @IsOptional()
  receiptDate: Date;

  @ApiProperty()
  @IsOptional()
  status: number;

  @ApiProperty()
  @IsOptional()
  explanation: string;

  @ApiProperty()
  @IsOptional()
  OrderType: OrderType.INVENTORY_ADJUSTMENTS_IMPORT | OrderType.INVENTORY_ADJUSTMENTS_EXPORT
    
  @ApiProperty()
  @IsOptional()
  warehouse: Warehouse;

  @ApiProperty()
  @IsOptional()
  source: RelationData;

  @ApiProperty()
  @IsOptional()
  reason: RelationData;

  @ApiProperty()
  @IsOptional()
  departmentReceipt: RelationData;

  @ApiProperty()
  @IsOptional()
  warehouseExportProposals: WarehouseExportProposal;

  @ApiProperty()
  @IsOptional()
  construction: Construction;

  @ApiProperty()
  @IsOptional()
  items: Items[];
}

export class InventoryAdjustmentRequest extends BaseDto  {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: ActionType;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InventoryAdjustment)
  data: InventoryAdjustment;
}
