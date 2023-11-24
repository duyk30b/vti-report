import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from 'src/mongo/base.schema'

export enum EItemStockStatus {
  Import = 1, // Nhập chưa cất
  ImportAndPutAway = 2, // Nhập đã cẩt
  Pickup = 3, // Lấy chưa xuất
}

@Schema({ collection: 'item_stock_daily', timestamps: true })
export class ItemStockDaily extends BaseSchema {
  @Prop()
  timestampSync: number

  @Prop()
  warehouseId: number

  @Prop()
  warehouseName: string

  @Prop()
  itemId: number

  @Prop()
  itemCode: string

  @Prop()
  itemNameVn: string

  @Prop()
  itemNameJp: string

  @Prop()
  itemNameEn: string

  @Prop()
  itemTypeCode: string // Mã loại sản phẩm

  @Prop()
  itemTypeName: string // Tên loại sản phẩm

  @Prop()
  costCenterCode: string // Cost center

  @Prop()
  costCenterNameEn: string // Cost center

  @Prop()
  costCenterNameVi: string // Cost center

  @Prop()
  costCenterNameJp: string // Cost center

  @Prop()
  lotNumber: string // Lô

  @Prop()
  bomVersionId: number // BOM version ID

  @Prop()
  bomVersionCode: string // BOM version

  @Prop()
  quality: string // Chất lượng

  @Prop()
  packingCode: string // Mã quy cách đóng gói

  @Prop()
  packingName: string // Tên quy cách đóng gói

  @Prop()
  bundle: string // Bundle

  @Prop()
  boxCode: string // Mã thùng

  @Prop()
  importDate: Date // Ngày nhập kho

  @Prop()
  locatorId: string // ID vị trí

  @Prop()
  locatorName: string // Tên vị trí

  @Prop({ type: Number, enum: EItemStockStatus })
  status: EItemStockStatus

  @Prop()
  quantityPrimary: number // số lượng tính theo đơn vị tính chính

  @Prop()
  quantitySecondary: number // số lượng tính theo đơn vị tính phụ

  @Prop()
  unitCodePrimary: string // mã đơn vị tính chính

  @Prop()
  unitCodeSecondary: string // mã đơn vị tính phụ

  @Prop()
  unitNamePrimary: string // tên đơn vị tính chính

  @Prop()
  unitNameSecondary: string // tên đơn vị tính phụ
}

const ItemStockDailySchema = SchemaFactory.createForClass(ItemStockDaily)
ItemStockDailySchema.index({ timestampSync: 1 }, { unique: false })

export { ItemStockDailySchema }

export type ItemStockDailyType = Omit<ItemStockDaily, keyof Document<ItemStockDaily>>
