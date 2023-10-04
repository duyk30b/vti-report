import { Prop } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export class BaseSchema extends Document {
  @Prop()
  createdBy: number

  @Prop()
  updatedBy: number

  @Prop()
  deletedBy: number

  @Prop()
  deletedAt: Date

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}
