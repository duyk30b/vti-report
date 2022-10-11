import { Types } from 'mongoose';
import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { ObjectIdLike } from 'bson';

export const IS_NOSQL_ID = 'isNoSqlId';

export function isNoSqlId(
  val: number | string | Types.ObjectId | Uint8Array | ObjectIdLike,
): boolean {
  return Types.ObjectId.isValid(val);
}

export function IsNoSqlId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_NOSQL_ID,
      validator: {
        validate: (value): boolean => isNoSqlId(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property must be a valid NoSQL ID',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
