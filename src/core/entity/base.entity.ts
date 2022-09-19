import { Document } from 'mongoose';

export class BaseEntity extends Document {
  id: string;

  createdBy: number;

  updatedBy: number;

  deletedBy: number;

  deletedAt: Date;

  createdAt: Date;

  updatedAt: Date;
}
