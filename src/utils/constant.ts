import { ReportType } from '@enums/report-type.enum';
import { TableColumn } from '@models/report.model';

export const LANG = {
  EN: 'en',
  VI: 'vi',
};

export const DEFAULT_LANG = LANG.VI;

export const TIMEZONE_HCM_CITY = 'Asia/Ho_Chi_Minh';
export const DATE_FOMAT = 'YYYY-MM-DD';
export const DATE_FOMAT_EXCELL = 'DD/MM/YYYY';
export const DATE_FOMAT_EXCELL_MM_DD_YY = 'MM/DD/YYYY';
export const DATE_FOMAT_EXCELL_FILE = 'DDMMYYYY';
export const DATE_FORMAT_TIME_HH_MM_SS = 'DD/MM/YYYY HH:mm:ss';
export const FONT_NAME = 'Times New Roman';
export const COLOR = '000000';
export const CELL_A = 'A';
export const EXCEL_COLUMN = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
];

export const FONT_BOLD_10 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 10,
};

export const FONT_BOLD_11 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 11,
};

export const FONT_BOLD_14 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 14,
};

export const FONT_BOLD_8 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 8,
};

export const FONT_BOLD_9 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 9,
};

export const FONT_BOLD_12 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 12,
};

export const FONT_NORMAL_10 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: false,
  size: 10,
};

export const FONT_NORMAL_9 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: false,
  size: 9,
};

export const FONT_ITALIC_10 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  italic: true,
  size: 10,
};
export const FONT_ITALIC_8 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  italic: true,
  size: 8,
};
export const FONT_ITALIC_9 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  italic: true,
  size: 9,
};
export const FONT_TITLE = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 14,
};

export const ALIGNMENT_CENTER = {
  wrapText: true,
  horizontal: 'center',
  vertical: 'middle',
};

export const ALIGNMENT_LEFT = {
  wrapText: true,
  horizontal: 'left',
  vertical: 'middle',
};

export const ALIGNMENT_RIGHT = {
  wrapText: true,
  horizontal: 'right',
  vertical: 'middle',
};

export const ALIGNMENT_CENTER_BOTTOM = {
  wrapText: true,
  horizontal: 'center',
  vertical: 'bottom',
};

export const ALIGNMENT_CENTER_LEFT = {
  wrapText: true,
  horizontal: 'center',
  vertical: 'left',
};

export const ALIGNMENT_CENTER_RIGHT = {
  wrapText: true,
  horizontal: 'center',
  vertical: 'right',
};

export const ALIGNMENT_CENTER_TOP = {
  wrapText: true,
  horizontal: 'center',
  vertical: 'top',
};

export const ALIGNMENT_BOTTOM = {
  wrapText: true,
  vertical: 'bottom',
};

export const ALIGNMENT_BOTTOM_LEFT = {
  wrapText: true,
  horizontal: 'left',
  vertical: 'bottom',
};

export const ALIGNMENT_BOTTOM_RIGHT = {
  wrapText: true,
  horizontal: 'right',
  vertical: 'bottom',
};
export const REPORT_INFO = {
  [ReportType[ReportType.ITEM_INVENTORY_BELOW_MINIMUM]]: {
    key: 'ITEM_INVENTORY_BELOW_MINIMUM',
  },
  [ReportType[ReportType.ITEM_INVENTORY_BELOW_SAFE]]: {
    key: 'ITEM_INVENTORY_BELOW_SAFE',
  },
  [ReportType[ReportType.ORDER_TRANSFER_INCOMPLETED]]: {
    key: 'ORDER_TRANSFER_INCOMPLETED',
  },
  [ReportType[ReportType.ORDER_EXPORT_INCOMPLETED]]: {
    key: 'ORDER_EXPORT_INCOMPLETED',
  },
  [ReportType[ReportType.ORDER_IMPORT_INCOMPLETED]]: {
    key: 'ORDER_IMPORT_INCOMPLETED',
  },
  [ReportType[ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION]]: {
    key: 'ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION',
  },
  [ReportType[ReportType.ITEM_INVENTORY]]: {
    key: 'ITEM_INVENTORY',
  },
  [ReportType[ReportType.ORDER_IMPORT_BY_REQUEST_FOR_ITEM]]: {
    key: 'ORDER_IMPORT_BY_REQUEST_FOR_ITEM',
  },
  [ReportType[ReportType.INVENTORY]]: {
    key: 'INVENTORY',
  },
  [ReportType[ReportType.ITEM_INVENTORY_IMPORTED_NO_QR_CODE]]: {
    key: 'ITEM_INVENTORY_IMPORTED_NO_QR_CODE',
  },
  [ReportType[ReportType.ORDER_EXPORT_BY_REQUEST_FOR_ITEM]]: {
    key: 'ORDER_EXPORT_BY_REQUEST_FOR_ITEM',
  },
  [ReportType[ReportType.SITUATION_TRANSFER]]: {
    key: 'SITUATION_TRANSFER',
  },
  [ReportType[ReportType.SITUATION_INVENTORY_PERIOD]]: {
    key: 'SITUATION_INVENTORY_PERIOD',
  },
  [ReportType[ReportType.SITUATION_IMPORT_PERIOD]]: {
    key: 'SITUATION_IMPORT_PERIOD',
  },
  [ReportType[ReportType.SITUATION_EXPORT_PERIOD]]: {
    key: 'SITUATION_EXPORT_PERIOD',
  },
  [ReportType[ReportType.AGE_OF_ITEM_STOCK]]: {
    key: 'AGE_OF_ITEM_STOCK',
  },
};
export const FORMAT_DATE_EXCEL = 'DD/MM/YYYY';
export const FORMAT_DATE = 'YYYY-MM-DD';

export const BORDER = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export const BORDER_L = {
  left: { style: 'thin' },
};

export const BORDER_T_R_B = {
  top: { style: 'thin' },
  right: { style: 'thin' },

  bottom: { style: 'thin' },
};

export const BORDER_T_L_B = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
};

export const BORDER_R = {
  right: { style: 'thin' },
};

export const BORDER_B = {
  bottom: { style: 'thin' },
};

export const BORDER_R_B = {
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export const BORDER_T_B_L = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
};

export const BORDER_T_B_R = {
  top: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export const CELL_PARENT_COMPANY = 'A1:B1';
export const CELL_CHILD_COMPANY = 'A2:C2';
export const CELL_ADDRESS_CHILD_COMPANY = 'A3:B3';
export const CELL_REPORT_NUMBER = 'A4:B4';
export const CELL_TITLE_REPORT = 'A5';
export const CELL_TITLE_REPORT_WAREHOUSE = 'A6';
export const CEll_REPORT_TIME = 'A7';
export const MONTHS = 'months';
export const YEARS = 'years';
export const COLUMN_COLOR = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'd6d6d6' },
};

export const ARR_REPORT_TYPE_CHANGE_TITLE_EXCELL = [
  ReportType.ITEM_INVENTORY_BELOW_MINIMUM,
  ReportType.AGE_OF_ITEM_STOCK,
  ReportType.ORDER_IMPORT_INCOMPLETED,
  ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION,
  ReportType.ORDER_EXPORT_INCOMPLETED,
  ReportType.ORDER_TRANSFER_INCOMPLETED,
  ReportType.ITEM_INVENTORY_BELOW_SAFE,
  ReportType.ITEM_INVENTORY,
  ReportType.SITUATION_INVENTORY_PERIOD,
];

export const LOCATION_CELL_REPORT_TYPE_CHANGE_TITLE_EXCELL = {
  CELL_TITLE_REPORT: 'A4',
  CELL_TITLE_REPORT_WAREHOUSE: 'A5',
  CEll_REPORT_TIME: 'A6',
};

export const LOCATION_CELL_TITLE_NOT_COMPANY = {
  CELL_TITLE_REPORT: 'A1',
  CELL_TITLE_REPORT_WAREHOUSE: 'A2',
  CEll_REPORT_TIME: 'A3',
  INDEX_REPORT_TITLE: 1,
  INDEX_REPORT_WAREHOUSE: 2,
  INDEX_REPORT_TIME: 3,
};

export const WORD_FILE_CONFIG = {
  WORD_FONT_SIZE_9: 18,
  WORD_FONT_SIZE_10: 20,
  WORD_FONT_SIZE_11: 22,
  WORD_FONT_SIZE_12: 24,
  WORD_FONT_SIZE_14: 28,
  WORD_PARAGRAPH_SPACING: 20 * 72 * 0.05,
  WORD_BOLD: true,
  COLUMN_COMPANY_WIDTH: 4.3,
  COLUMN_COMPANY_WIDTH_W006: 3,
  TABLE_HEADER_HEIGHT: 500,
  TABLE_ROW_HEIGHT: 300,
  PAGE_SIZE_A4_WIDTH: 11.69,
  PAGE_SIZE_A4_HEIGHT: 8.27,
  PAGE_SIZE_A3_WIDTH: 16.54,
  PAGE_SIZE_A3_HEIGHT: 11.69,
  MARGIN_LEFT: 0.04,
  MARGIN_RIGHT: 0.04,
  SPACING_BEFORE: 0.2,
  TABLE_WIDTH_PAGE_A4: 9.687,
  TABLE_WIDTH_PAGE_A3: 14.5,
};

export const REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG_COLUMNS: TableColumn[] =
  [
    {
      name: 'INDEX',
      width: 3,
    },
    {
      name: 'ITEM_CODE',
      width: 1.8,
    },
    {
      name: 'ITEM_NAME',
      width: 2.6,
    },
    {
      name: 'UNIT',
      width: 0.5,
    },
    {
      name: 'QUANTITY_MINIMUM',
      width: 0.8,
    },
    {
      name: 'QUANTITY_STOCK',
      width: 0.6,
    },
  ];

export const REPORT_ITEM_INVENTORY_BELOW_SAFE_CONFIG_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.7,
  },
  {
    name: 'ITEM_CODE',
    width: 2.4,
  },
  {
    name: 'ITEM_NAME',
    width: 3,
  },
  {
    name: 'UNIT',
    width: 1,
  },
  {
    name: 'QUANTITY_SAFE',
    width: 1.2,
  },
  {
    name: 'QUANTITY_STOCK',
    width: 1,
  },
];

export const ORDER_TRANSFER_INCOMPLETED_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.7,
  },
  {
    name: 'ORDER_ID_WMSX',
    width: 1.4,
  },
  {
    name: 'ITEM_CODE',
    width: 1.6,
  },
  {
    name: 'ITEM_NAME',
    width: 3.6,
  },
  {
    name: 'UNIT',
    width: 0.8,
  },
  {
    name: 'QUANTITY',
    width: 0.8,
  },
  {
    name: 'CONTRUCTION',
    width: 1,
  },
  {
    name: 'WAREHOUSE_IMPORT',
    width: 3,
  },
];

export const ORDER_EXPORT_INCOMPLETED_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.5,
  },
  {
    name: 'ORDER_ID_WMSX',
    width: 1.2,
  },
  {
    name: 'VOUCHERS_DATE',
    width: 1.2,
  },
  {
    name: 'ITEM_CODE',
    width: 1.6,
  },
  {
    name: 'ITEM_NAME',
    width: 3.2,
  },
  {
    name: 'UNIT',
    width: 0.8,
  },
  {
    name: 'QUANTITY',
    width: 0.8,
  },
  {
    name: 'CONTRUCTION',
    width: 1.6,
  },
  {
    name: 'RECEIVER',
    width: 2,
  },
];

export const ORDER_IMPORT_INCOMPLETED_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.6,
  },
  {
    name: 'ORDER_ID_WMSX',
    width: 1.4,
  },
  {
    name: 'ORDER_CREATED_DATE',
    width: 1.2,
  },
  {
    name: 'UNIT_IMPORT_PRICE',
    width: 1.4,
  },
  {
    name: 'ITEM_CODE',
    width: 1.6,
  },
  {
    name: 'ITEM_NAME',
    width: 2.8,
  },
  {
    name: 'UNIT',
    width: 0.8,
  },
  {
    name: 'QUANTITY',
    width: 0.8,
  },
  {
    name: 'UNIT_PRICE',
    width: 0.8,
  },
  {
    name: 'TOTAL_PRICE',
    width: 0.8,
  },
  {
    name: 'CONTRUCTION',
    width: 1.4,
  },
  {
    name: 'DELIVER',
    width: 1.4,
  },
];

export const ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.6,
  },
  {
    name: 'ORDER_ID_IMPORT_WMSX',
    width: 1.4,
  },
  {
    name: 'ORDER_NUMBER_EBS',
    width: 1.4,
  },
  {
    name: 'REASON_IMPORT',
    width: 1,
  },
  {
    name: 'EXPLAIN',
    width: 2,
  },
  {
    name: 'ITEM_CODE',
    width: 1.6,
  },
  {
    name: 'ITEM_NAME',
    width: 2,
  },
  {
    name: 'UNIT',
    width: 0.6,
  },
  {
    name: 'LOT',
    width: 0.6,
  },
  {
    name: 'QUANTITY_IMPORT',
    width: 1,
  },
  {
    name: 'QUANTITY_RECEIVED',
    width: 1,
  },
  {
    name: 'QUANTITY_RECEIVE',
    width: 1,
  },
  {
    name: 'RECEIVER',
    width: 1.8,
  },
];

export const ORDER_IMPORT_BY_REQUEST_FOR_ITEM_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.8,
  },
  {
    name: 'ORDER_CODE',
    width: 1.7,
  },
  {
    name: 'ORDER_IMPORT_CODE',
    width: 1.7,
  },
  {
    name: 'ITEM_CODE',
    width: 1.8,
  },
  {
    name: 'ITEM_NAME',
    width: 3,
  },
  {
    name: 'DATE_IMPORT',
    width: 1.4,
  },
  {
    name: 'QUANTITY_PYC',
    width: 1.4,
  },
  {
    name: 'QUANTITY_IMPORT',
    width: 1.4,
  },
  {
    name: 'STATUS',
    width: 1.4,
  },
];

export const INVENTORY_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.8,
  },
  {
    name: 'ITEM_CODE',
    width: 2.2,
  },
  {
    name: 'ITEM_NAME',
    width: 2.6,
  },
  {
    name: 'UNIT',
    width: 0.8,
  },
  {
    name: 'LOT',
    width: 0.8,
  },
  {
    name: 'MANUFACTURING_COUNTRY',
    width: 1,
  },
  {
    name: 'LOCATION',
    width: 1.6,
  },
  {
    name: 'QUANTITY_STOCK',
    width: 0.9,
  },
  {
    name: 'UNIT_PRICE',
    width: 1,
  },
  {
    name: 'TOTAL_PRICE',
    width: 1.4,
  },
];

export const ITEM_INVENTORY_IMPORTED_NO_QR_CODE_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.8,
  },
  {
    name: 'ORDER_EXPORT_CODE',
    width: 1.4,
  },
  {
    name: 'ITEM_CODE',
    width: 1.8,
  },
  {
    name: 'ITEM_NAME',
    width: 3,
  },
  {
    name: 'UNIT',
    width: 0.8,
  },
  {
    name: 'LOT',
    width: 0.8,
  },
  {
    name: 'LOCATION_IMPORT',
    width: 1.4,
  },
  {
    name: 'QUANTITY',
    width: 1.2,
  },
  {
    name: 'UNIT_PRICE',
    width: 1.2,
  },
  {
    name: 'TOTAL_PRICE',
    width: 1.4,
  },
];

export const ORDER_EXPORT_BY_REQUEST_FOR_ITEM_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.7,
  },
  {
    name: 'ITEM_CODE',
    width: 1.6,
  },
  {
    name: 'ITEM_NAME',
    width: 2.4,
  },
  {
    name: 'ORDER_REQUEST_EXPORT_ITEM',
    width: 1.4,
  },
  {
    name: 'ORDER_EXPORT_CODE',
    width: 1.4,
  },
  {
    name: 'DATE_EXPORT',
    width: 1,
  },
  {
    name: 'QUANTITY_REQUIRE',
    width: 0.8,
  },
  {
    name: 'QUANTITY_EXPORTED',
    width: 0.8,
  },
];

export const ITEM_INVENTORY_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.6,
    rowSpan: 2,
  },
  {
    name: 'ITEM_CODE',
    width: 1.8,
    rowSpan: 2,
  },
  {
    name: 'ITEM_NAME',
    width: 2.2,
    rowSpan: 2,
  },
  {
    name: 'UNIT',
    width: 0.8,
    rowSpan: 2,
  },
  {
    name: 'LOT',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'UNIT_PRICE',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'STOCK_QUANTITY_START',
    width: 1.8,
    columnSpan: 2,
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 0.9,
      },
      {
        name: 'TOTAL_SHORT',
        width: 0.9,
      },
    ],
  },
  {
    name: 'IMPORT_IN',
    width: 1.8,
    columnSpan: 2,
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 0.9,
      },
      {
        name: 'TOTAL_SHORT',
        width: 0.9,
      },
    ],
  },
  {
    name: 'EXPORT_IN',
    width: 1.8,
    columnSpan: 2,
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 0.9,
      },
      {
        name: 'TOTAL_SHORT',
        width: 0.9,
      },
    ],
  },
  {
    name: 'STOCK_QUANTITY_END',
    width: 1.8,
    columnSpan: 2,
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 0.9,
      },
      {
        name: 'TOTAL_SHORT',
        width: 0.9,
      },
    ],
  },
  {
    name: 'NOTE',
    width: 1.8,
    rowSpan: 2,
  },
];

export const SITUATION_TRANSFER_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.6,
    rowSpan: 2,
  },
  {
    name: 'POST',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ORDER_NUMBER_EBS',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'DATE',
    width: 0.8,
    rowSpan: 2,
  },
  {
    name: 'WAREHOUSE_IMPORT',
    width: 1.6,
    rowSpan: 2,
  },
  {
    name: 'EXPLAIN',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ITEM_CODE',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ITEM_NAME',
    width: 2,
    rowSpan: 2,
  },
  {
    name: 'LOT',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'ACCOUNT',
    width: 1.8,
    columnSpan: 2,
    child: [
      {
        name: 'DEB',
        width: 0.9,
      },
      {
        name: 'HAVE',
        width: 0.9,
      },
    ],
  },
  {
    name: 'UNIT',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'QUANTITY',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'LOCATION_GET',
    width: 1.6,
    rowSpan: 2,
  },
  {
    name: 'UNIT_PRICE',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'TOTAL_PRICE',
    width: 1.2,
    rowSpan: 2,
  },
];

export const SITUATION_IMPORT_PERIOD_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.6,
    rowSpan: 2,
  },
  {
    name: 'POST',
    width: 1.4,
    rowSpan: 2,
  },
  {
    name: 'ORDER_NUMBER_EBS',
    width: 1.4,
    rowSpan: 2,
  },
  {
    name: 'DATE',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'CONTRACT',
    width: 1.4,
    rowSpan: 2,
  },
  {
    name: 'CONTRUCTION',
    width: 1.4,
    rowSpan: 2,
  },
  {
    name: 'PROVIDER_SHORT',
    width: 1.6,
    rowSpan: 2,
  },
  {
    name: 'DEPARTMENT_RECEIPT',
    width: 1.6,
    rowSpan: 2,
  },
  {
    name: 'EXPLAIN',
    width: 0.9,
    rowSpan: 2,
  },
  {
    name: 'ITEM_CODE',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ITEM_NAME',
    width: 1.8,
    rowSpan: 2,
  },
  {
    name: 'LOT',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'ACCOUNT',
    width: 2.2,
    columnSpan: 2,
    child: [
      {
        name: 'DEB',
        width: 0.8,
      },
      {
        name: 'HAVE',
        width: 1.4,
      },
    ],
  },
  {
    name: 'UNIT',
    width: 0.9,
    rowSpan: 2,
  },
  {
    name: 'QUANTITY',
    width: 0.9,
    rowSpan: 2,
  },
  {
    name: 'LOCATION',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'UNIT_PRICE',
    width: 0.9,
    rowSpan: 2,
  },
  {
    name: 'COST',
    width: 0.9,
    rowSpan: 2,
  },
  {
    name: 'TOTAL_PRICE',
    width: 1.2,
    rowSpan: 2,
  },
];
export const SITUATION_EXPORT_PERIOD_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.6,
    rowSpan: 2,
  },
  {
    name: 'POST',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ORDER_NUMBER_EBS',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'DATE',
    width: 0.8,
    rowSpan: 2,
  },
  {
    name: 'CONTRUCTION',
    width: 1.4,
    rowSpan: 2,
  },
  {
    name: 'RECEIVER_DEPARMENT',
    width: 1.2,
    rowSpan: 2,
  },
  {
    name: 'EXPLAIN',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ITEM_CODE',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ITEM_NAME',
    width: 2,
    rowSpan: 2,
  },
  {
    name: 'LOT',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'ACCOUNT',
    width: 1.8,
    columnSpan: 2,
    child: [
      {
        name: 'DEB',
        width: 0.9,
      },
      {
        name: 'HAVE',
        width: 0.9,
      },
    ],
  },
  {
    name: 'UNIT',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'QUANTITY',
    width: 1.8,
    columnSpan: 2,
    child: [
      {
        name: 'QUANTITY_REQUIRE',
        width: 0.9,
      },
      {
        name: 'EXPORT_ACTUAL',
        width: 0.9,
      },
    ],
  },
  {
    name: 'LOCATION_EXPORT',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'UNIT_PRICE',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'TOTAL_PRICE',
    width: 1.2,
    rowSpan: 2,
  },
];

export const AGE_OF_ITEM_STOCK_COLUMNS: TableColumn[] = [
  {
    name: 'ITEM_CODE',
    width: 0.9,
    rowSpan: 2,
  },
  {
    name: 'ITEM_NAME',
    width: 0.9,
    rowSpan: 2,
  },
  {
    name: 'DATE_IMPORT',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ORIGIN',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ACCOUNT',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'LOT',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'LOCATION',
    width: 0.7,
    rowSpan: 2,
  },
  {
    name: 'INVENTORY_COLUMN',
    width: 3.2,
    columnSpan: 4,
    child: [
      {
        name: 'UNIT',
        width: 0.8,
      },
      {
        name: 'QUANTITY_SHORT',
        width: 0.8,
      },
      {
        name: 'UNIT_PRICE',
        width: 0.8,
      },
      {
        name: 'TOTAL_SHORT',
        width: 0.8,
      },
    ],
  },
  {
    name: 'SIX_MONTH',
    width: 0.8,
    rowSpan: 2,
  },
  {
    name: 'SIX_MONTH_TO_ONE_YEAR',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'ONE_YEAR_TO_TWO_YEAR',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'TWO_YEAR_TO_THREE_YEAR',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'THREE_YEAR_TO_FOUR_YEAR',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'FOUR_YEAR_TO_FIVE_YEAR',
    width: 1,
    rowSpan: 2,
  },
  {
    name: 'GREATER_FIVE_YEAR',
    width: 0.8,
    rowSpan: 2,
  },
];

export const SITUATION_INVENTORY_PERIOD_COLUMNS: TableColumn[] = [
  {
    name: 'INDEX',
    width: 0.6,
    rowSpan: 3,
  },
  {
    name: 'ITEM_CODE',
    width: 1.6,
    rowSpan: 3,
  },
  {
    name: 'ITEM_NAME',
    width: 2,
    rowSpan: 3,
  },
  {
    name: 'UNIT',
    width: 0.8,
    rowSpan: 3,
  },
  {
    name: null,
    width: 0.8,
    rowSpan: 2,
    child: [
      {
        name: 'LOT',
      },
    ],
  },
  {
    name: 'ACCORDING_BOOK_QUANTITY',
    width: 2.4,
    rowSpan: 2,
    columnSpan: 3,
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 0.8,
      },
      {
        name: 'UNIT_PRICE_SHORT',
        width: 0.8,
      },
      {
        name: 'TOTAL_SHORT',
        width: 0.8,
      },
    ],
  },
  {
    name: 'ACCORDING_INVENTORY',
    width: 2.4,
    rowSpan: 2,
    columnSpan: 3,
    child: [
      {
        name: 'QUANTITY_SHORT',
        width: 0.8,
      },
      {
        name: 'UNIT_PRICE_SHORT',
        width: 0.8,
      },
      {
        name: 'TOTAL_SHORT',
        width: 0.8,
      },
    ],
  },
  {
    name: 'DEVIANT',
    width: 3.2,
    columnSpan: 4,
    child: [
      {
        name: 'EXCESS',
        width: 1.6,
        columnSpan: 2,
        child: [
          {
            name: 'QUANTITY_SHORT',
            width: 0.8,
          },
          {
            name: 'TOTAL_SHORT',
            width: 0.8,
          },
        ],
      },
      {
        name: 'LACK',
        width: 1.6,
        columnSpan: 2,
        child: [
          {
            name: 'QUANTITY_SHORT',
            width: 0.8,
          },
          {
            name: 'TOTAL_SHORT',
            width: 0.8,
          },
        ],
      },
    ],
  },
  {
    name: 'NOTE',
    width: 1.4,
    rowSpan: 3,
  },
];

export const INDEX_REPORT_TITLE = 5;
export const HEIGHT_REPORT_TITLE = 30;
export const INDEX_REPORT_TIME = 7;
export const INDEX_REPORT_WAREHOUSE = 6;
export const KEY_COLUMN = 'child';
export const ROW_WHEN_HAVE_HEADER = 8;
export const ROW_WHEN_NOT_HAVE_HEADER = 1;

export const LV1 = 1;
export const LV3 = 3;

export const LENGTH_ACCOUNT_SYNC_EBS = 60;
