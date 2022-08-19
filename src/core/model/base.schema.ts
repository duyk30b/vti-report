import { Schema } from 'mongoose';
import { DEFAULT_COLLATION } from '../../constant/common';
export const BaseSchema = (collection: string, schema: object): Schema => {
  const baseSchema = new Schema(
    {
      createdBy: {
        type: Number,
      },
      updatedBy: {
        type: Number,
      },
      deletedAt: {
        type: String,
      },
      deletedBy: {
        type: Number,
      },
      ...schema,
    },
    {
      timestamps: true,
      collection: collection,
      collation: DEFAULT_COLLATION,
    },
  );
  return baseSchema;
};
