import { TableColumn } from '@models/report.model';

export const REORDER_QUANTITY_COLUMN: TableColumn[] = [
  {
    name: 'COMPANY',
    width: 10,
  },
  {
    name: 'WAREHOUSE',
    width: 25,
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
    name: 'ITEM_UNIT',
    width: 10,
  },
  {
    name: 'REORDER_QUANTITY_NUMBER',
    width: 25,
  },
];
