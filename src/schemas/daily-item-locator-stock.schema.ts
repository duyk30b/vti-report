import { Schema, Types } from 'mongoose';

export const DailyItemLocatorStockSchema = new Schema(
  {
    dailyWarehouseItemStockId: {
      type: Types.ObjectId,
      required: true,
    },
    warehouseId: {
      type: Types.ObjectId,
      required: true,
    },
    locatorId: {
      type: Types.ObjectId,
      required: true,
    },
    itemId: {
      type: Types.ObjectId,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },

    reportDate: {
      type: String,
      required: true,
    },
    locatorName: {
      type: String,
      required: true,
    },
    locatorCode: {
      type: String,
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
