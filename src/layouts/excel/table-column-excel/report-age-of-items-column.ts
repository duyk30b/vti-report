import { TableColumn } from '@models/report.model';

export const AGE_OF_ITEMS_COLUMN: TableColumn[] = [
  {
    name: 'ITEM_CODE',
    width: 35,
  },
  {
    name: 'ITEM_NAME',
    width: 20,
  },
  {
    name: 'DATE_IMPORT',
    width: 20,
  },
  {
    name: 'ORIGIN',
    width: 30,
  },
  {
    name: 'ACCOUNT',
    width: 20,
  },
  {
    name: 'LOT',
    width: 5,
  },
  {
    name: 'LOCATION',
    width: 15,
  },
  {
    name: 'INVENTORY_COLUMN',
    child: [
      {
        name: 'UNIT',
        width: 15,
      },
      {
        name: 'QUANTITY_SHORT',
        width: 15,
      },
      {
        name: 'UNIT_PRICE',
        width: 15,
      },
      {
        name: 'TOTAL_SHORT',
        width: 15,
      },
    ],
  },
  {
    name: 'SIX_MONTH',
    width: 20,
  },
  {
    name: 'SIX_MONTH_TO_ONE_YEAR',
    width: 20,
  },
  {
    name: 'ONE_YEAR_TO_TWO_YEAR',
    width: 20,
  },
  {
    name: 'TWO_YEAR_TO_THREE_YEAR',
    width: 20,
  },
  {
    name: 'THREE_YEAR_TO_FOUR_YEAR',
    width: 20,
  },
  {
    name: 'FOUR_YEAR_TO_FIVE_YEAR',
    width: 20,
  },
  {
    name: 'GREATER_FIVE_YEAR',
    width: 20,
  },
];
