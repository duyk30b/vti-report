import { TableColumn } from '@models/report.model';

export const ITEM_INVENTORY_COLUMN: TableColumn[] = [
  {
    name: 'INDEX',
    width: 35,
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
    width: 10,
  },
  {
    name: 'UNIT_PRICE',
    width: 10,
  },
  {
    name: 'STOCK_QUANTITY_START',
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
    name: 'IMPORT_IN',
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
    name: 'EXPORT_IN',
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 5,
      },
      {
        name: 'TOTAL_SHORT',
        width: 5,
      },
    ],
  },
  {
    name: 'STOCK_QUANTITY_END',
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 5,
      },
      {
        name: 'TOTAL_SHORT',
        width: 5,
      },
    ],
  },
  {
    name: 'NOTE',
    width: 25,
  },
];
