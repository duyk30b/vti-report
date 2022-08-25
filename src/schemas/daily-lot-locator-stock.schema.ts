import { Schema, Types } from 'mongoose';

export const DailyLotlocatorStockSchema = new Schema(
  {
    dailyWarehouseItemStockId: {
      type: Types.ObjectId,
      required: true,
    },
    dailyItemLocatorStockId: {
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
    lotNumber: {
      type: String,
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
    storageDate: {
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
    orderId: {
      type: Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
