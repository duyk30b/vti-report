import { Schema } from 'mongoose';
import { EXAMPLE_ENUM } from 'src/enums/example/example.enum';

export const ExampleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: EXAMPLE_ENUM.NAME.MAX_LENGTH,
    },
  },
  {
    timestamps: true,
  },
);
