import { TableColumn } from '@models/report.model';

export const ITEM_INVENTORY_BELOW_MINIMUM: TableColumn[] = [
  {
    name: 'INDEX',
    width: 35.9,
  },
  {
    name: 'ITEM_CODE',
    width: 19.9,
  },
  {
    name: 'ITEM_NAME',
    width: 39.9,
  },
  {
    name: 'UNIT',
    width: 10,
  },
  {
    name: 'QUANTITY_MINIMUM',
    width: 14,
  },
  {
    name: 'QUANTITY_STOCK',
    width: 14,
  },
];
