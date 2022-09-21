import { TableColumn } from '@models/report.model';

export const INVENTORY_COLUMN: TableColumn[] = [
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
    name: 'QUANTITY_STOCK',
    width: 10,
  },
  {
    name: 'LOCATION',
    width: 20,
  },
  {
    name: 'UNIT_PRICE',
    width: 10,
  },
  {
    name: 'TOTAL_PRICE',
    width: 10,
  },
];
