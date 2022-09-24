import { Schema, Types } from 'mongoose';

export const DailyWarehouseItemStockSchema = new Schema(
  {
    itemId: {
      type: Types.ObjectId,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    warehouseId: {
      type: Types.ObjectId,
      required: true,
    },
    reportDate: {
      type: String,
      required: true,
    },
    minInventoryLimit: {
      type: Number,
      required: true,
    },
    inventoryLimit: {
      type: Number,
      required: true,
    },
    storageCost: {
      type: Number,
      required: true,
    },
    companyId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
