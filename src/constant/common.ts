import * as dotenv from 'dotenv';
dotenv.config();

export enum APIPrefix {
  Version = 'api/v1',
}
export const FORMAT_CODE_PERMISSION = 'WAREHOUSE_LAYOUT_';

export enum SortOrder {
  Ascending = 1,
  Descending = -1,
}

export const SORT_CONST = {
  ASCENDING: 'asc',
  DESCENDING: 'desc',
};
