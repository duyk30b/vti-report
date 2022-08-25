import * as dotenv from 'dotenv';
import { CollationOptions } from 'mongodb';
dotenv.config();

export enum APIPrefix {
  Version = 'api/v1/reports',
}
export const FORMAT_CODE_PERMISSION = 'REPORT_';

export enum SortOrder {
  Ascending = 1,
  Descending = -1,
}

export const DEFAULT_COLLATION: CollationOptions = {
  locale: 'vi',
};

export const SORT_CONST = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};

//permission
export enum StatusPermission {
  ACTIVE = 1,
  INACTIVE = 0,
}
