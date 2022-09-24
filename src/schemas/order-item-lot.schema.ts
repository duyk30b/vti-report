import { Schema, Types } from 'mongoose';

export const OrderItemLotSchema = new Schema(
  {
    reportOrderId: {
      type: Types.ObjectId,
      required: true,
    },
    orderId: {
      type: Types.ObjectId,
      required: true,
    },
    itemId: {
      type: Types.ObjectId,
      required: true,
    },
    planQuantity: {
      type: Number,
      required: true,
    },
    actualQuantity: {
      type: Number,
      required: true,
    },
    receivedQuantity: {
      type: Number,
      required: true,
    },
    storedQuantity: {
      type: Number,
      required: true,
    },
    collectedQuantity: {
      type: Number,
      required: true,
    },
    exportedQuantity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
