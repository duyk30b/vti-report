import { TableColumn } from '@models/report.model';

export const SITUATION_TRANSFER_COLUMN: TableColumn[] = [
  {
    name: 'INDEX',
    width: 35,
  },
  {
    name: 'POST',
    width: 25,
  },
  {
    name: 'DATE',
    width: 10,
  },
  {
    name: 'WAREHOUSE_IMPORT',
    width: 35,
  },
  {
    name: 'EXPLAIN',
    width: 10,
  },
  {
    name: 'ITEM_CODE',
    width: 25,
  },
  {
    name: 'ITEM_NAME',
    width: 35,
  },
  {
    name: 'LOT',
    width: 10,
  },
  {
    name: 'ACCOUNT',
    child: [
      {
        name: 'DEB',
        width: 10,
      },
      {
        name: 'HAVE',
        width: 10,
      },
    ],
  },
  {
    name: 'UNIT',
    width: 10,
  },
  {
    name: 'QUANTITY',
    width: 10,
  },
  {
    name: 'LOCATION',
    width: 20,
  },
  {
    name: 'UNIT_PRICE',
    width: 25,
  },
  {
    name: 'TOTAL_PRICE',
    width: 25,
  },
];
