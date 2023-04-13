import { TableColumn } from '@models/report.model';

export const REPORT_ORDER_TRANSFER_INCOMPLETE_COLUMN: TableColumn[] = [
  {
    name: 'INDEX',
    width: 10,
  },
  {
    name: 'ORDER_ID_WMSX',
    width: 25,
  },
  {
    name: 'ITEM_CODE',
    width: 25,
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
    name: 'LOT',
    width: 15,
  },
  {
    name: 'QUANTITY',
    width: 10,
  },
  {
    name: 'CONTRUCTION',
    width: 20,
  },
  {
    name: 'WAREHOUSE_IMPORT',
    width: 30,
  },
];
