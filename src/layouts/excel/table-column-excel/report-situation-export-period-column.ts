import { TableColumn } from '@models/report.model';

export const SITUATION_EXPORT_PERIOD_COLUMN: TableColumn[] = [
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
    name: 'CONTRUCTION',
    width: 15,
  },
  {
    name: 'RECEIVER_DEPARMENT',
    width: 15,
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
    width: 5,
  },
  {
    name: 'ACCOUNT',
    child: [
      {
        name: 'DEB',
        width: 20,
      },
      {
        name: 'HAVE',
        width: 15,
      },
    ],
  },
  {
    name: 'UNIT',
    width: 10,
  },
  {
    name: 'QUANTITY',
    child: [
      {
        name: 'REQUIRE',
        width: 10,
      },
      {
        name: 'EXPORT_ACTUAL',
        width: 10,
      },
    ],
  },
  {
    name: 'LOCATION_EXPORT',
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
];
