import { TableColumn } from '@models/report.model';

export const REPORT_ORDER_EXPORT_BY_REQUEST_FOR_ITEM_MODEL: TableColumn[] = [
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
    name: 'ORDER_REQUEST_EXPORT_ITEM',
    width: 25,
  },
  {
    name: 'ORDER_IMPORT_CODE',
    width: 25,
  },
  {
    name: 'DATE_EXPORT',
    width: 10,
  },
  {
    name: 'QUANTITY_REQUIRE',
    width: 10,
  },
  {
    name: 'QUANTITY_EXPORTED',
    width: 20,
  },
];
