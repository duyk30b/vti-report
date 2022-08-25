import { Schema, Types } from 'mongoose';

export const OrderSchema = new Schema(
  {
    orderId: {
      type: Types.ObjectId,
      required: true,
    },
    orderName: {
      type: String,
      required: true,
    },
    orderCreatedAt: {
      type: String,
      required: true,
    },
    warehouseId: {
      type: Types.ObjectId,
      required: true,
    },
    orderType: {
      type: Number,
      required: true,
    },
    actionType: {
      type: Number,
      required: true,
    },
    planDate: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: String,
      required: true,
    },
    companyId: {
      type: Types.ObjectId,
      required: true,
    },
    ebsId: {
      type: Types.ObjectId,
      required: true,
    },
    constructionId: {
      type: Types.ObjectId,
      required: true,
    },
    constructionCode: {
      type: String,
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
