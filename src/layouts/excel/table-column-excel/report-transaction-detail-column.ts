import { TableColumn } from '@models/report.model';

export const TRANSACTION_DETAIL_COLUMN: TableColumn[] = [
  {
    name: 'WAREHOUSE',
    width: 20,
  },
  {
    name: 'ITEM_CODE',
    width: 20,
  },
  {
    name: 'ITEM_NAME',
    width: 25,
  },
  {
    name: 'UNIT',
    width: 10,
  },
  {
    name: 'QUANTITY',
    width: 15,
  },
  {
    name: 'UNIT_PRICE',
    width: 15,
  },
  {
    name: 'TOTAL_PRICE',
    width: 15,
  },
  {
    name: 'ORIGIN_ITEM',
    width: 10,
  },
  {
    name: 'ORDER_CODE_WMS',
    width: 15,
  },
  {
    name: 'ORDER_CODE_EBS',
    width: 15,
  },
  {
    name: 'TYPE_TRANSACTION',
    width: 10,
  },
  {
    name: 'ORDER_CREATED_DATE',
    width: 10,
  },
  {
    name: 'REASON_EN',
    width: 15,
  },
  {
    name: 'SOURCE_EN',
    width: 20,
  },
  {
    name: 'CONTRACT_NUMBER',
    width: 15,
  },
  {
    name: 'VENDOR',
    width: 15,
  },
  {
    name: 'CONTRUCTION',
    width: 15,
  },
  {
    name: 'EXPLAIN',
    width: 20,
  },
];
