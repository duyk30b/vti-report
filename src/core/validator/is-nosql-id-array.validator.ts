import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { Types } from 'mongoose';

export const IS_NOSQL_ID_ARRAY = 'isNoSqlIdArray';

export function isNoSqlIdArray(array: unknown): boolean {
  if (!Array.isArray(array)) return false;

  return array.every((value) => Types.ObjectId.isValid(value));
}

export function IsNoSqlIdArray(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_NOSQL_ID_ARRAY,
      validator: {
        validate: (value): boolean => isNoSqlIdArray(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property should not contain $constraint1 values',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
