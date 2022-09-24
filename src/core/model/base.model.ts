import { Document } from 'mongoose';

export class BaseModel extends Document {
  createdBy: number;
  updatedBy: number;
  deletedBy: number;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
