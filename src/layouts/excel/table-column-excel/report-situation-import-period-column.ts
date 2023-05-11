import { TableColumn } from '@models/report.model';

export const SITUATION_IMPORT_PERIOD_COLUMN: TableColumn[] = [
  {
    name: 'INDEX',
    width: 10,
  },
  {
    name: 'POST',
    width: 15,
  },
  {
    name: 'DATE',
    width: 10,
  },
  {
    name: 'CONTRACT',
    width: 15,
  },
  {
    name: 'CONTRUCTION',
    width: 15,
  },
  {
    name: 'PROVIDER_SHORT',
    width: 20,
  },
  {
    name: 'DEPARTMENT_RECEIPT',
    width: 20,
  },
  {
    name: 'EXPLAIN',
    width: 10,
  },
  {
    name: 'ITEM_CODE',
    width: 10,
  },
  {
    name: 'ITEM_NAME',
    width: 30,
  },
  {
    name: 'LOT',
    width: 20,
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
        width: 20,
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
    width: 15,
  },
  {
    name: 'UNIT_PRICE',
    width: 15,
  },
  {
    name: 'COST',
    width: 5,
  },
  {
    name: 'TOTAL_PRICE',
    width: 15,
  },
];
