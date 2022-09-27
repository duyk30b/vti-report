import { TableColumn } from '@models/report.model';

export const SITUATION_INVENTORY_PERIOD_COLUMN: TableColumn[] = [
  {
    name: 'INDEX',
    width: 25,
  },
  {
    name: 'ITEM_CODE',
    width: 15,
  },
  {
    name: 'ITEM_NAME',
    width: 25,
  },
  {
    name: 'UNIT',
    width: 5,
  },
  {
    name: 'LOT',
    width: 5,
  },
  {
    name: 'ACCORDING_BOOK_QUANTITY',
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 10,
      },
      {
        name: 'UNIT_PRICE_SHORT',
        width: 10,
      },
      {
        name: 'TOTAL_SHORT',
        width: 10,
      },
    ],
  },
  {
    name: 'ACCORDING_INVENTORY',
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 10,
      },
      {
        name: 'UNIT_PRICE_SHORT',
        width: 10,
      },
      {
        name: 'TOTAL_SHORT',
        width: 10,
      },
    ],
  },
  {
    name: 'DEVIANT',
    child: [
      {
        name: 'EXCESS',
        child: [
          {
            name: 'QUANTITY_SHORT',
            width: 10,
          },
          {
            name: 'TOTAL_SHORT',
            width: 10,
          },
        ],
      },
      {
        name: 'LACK',
        child: [
          {
            name: 'QUANTITY_SHORT',
            width: 10,
          },
          {
            name: 'TOTAL_SHORT',
            width: 10,
          },
        ],
      },
    ],
  },
  {
    name: 'NOTE',
    width: 20,
  },
];
