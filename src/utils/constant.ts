import { OrderStatus } from '@enums/order-status.enum';
import { ReportType } from '@enums/report-type.enum';

export const LANG = {
  EN: 'en',
  VI: 'vi',
};

export const DEFAULT_LANG = LANG.VI;

export const DATE_FOMAT = 'YYYY-MM-DD';
export const DATE_FOMAT_EXCELL = 'DD/MM/YYYY';
export const DATE_FOMAT_EXCELL_FILE = 'DDMMYYYY';
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

export const FONT_NORMAL_10 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: false,
  size: 10,
};

export const FONT_NORMAL_8 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: false,
  size: 8,
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

export const CELL_PARENT_COMPANY = 'A1';
export const CELL_CHILD_COMPANY = 'A2';
export const CELL_ADDRESS_CHILD_COMPANY = 'A3';
export const CELL_REPORT_NUMBER = 'A4';
export const CELL_TITLE_REPORT = 'A5';
export const CEll_REPORT_TIME = 'A6';
export const MONTHS = 'months';
export const YEARS = 'years';
export const COLUMN_COLOR = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'd6d6d6' },
};

export const WORD_FILE_CONFIG = {
  WORD_FONT_SIZE_9: 18,
  WORD_FONT_SIZE_10: 20,
  WORD_FONT_SIZE_12: 24,
  WORD_FONT_SIZE_14: 28,
  WORD_PARAGRAPH_SPACING: 20 * 72 * 0.05,
  WORD_BOLD: true,
  COLUMN_COMPANY_WIDTH: 4.3,
  TABLE_HEADER_HEIGHT: 500,
  TABLE_ROW_HEIGHT: 300,
  PAGE_SIZE_A4_WIDTH: 11.69,
  PAGE_SIZE_A4_HEIGHT: 8.27,
  PAGE_SIZE_A3_WIDTH: 16.54,
  PAGE_SIZE_A3_HEIGHT: 11.69,
  MARGIN_LEFT: 0.04,
  MARGIN_RIGHT: 0.04,
};

export const REPORT_ITEM_INVENTORY_BELOW_MINIMUM_CONFIG = {
  TABLE_WIDTH: 9.687,
  TABLE_COLUMN_WIDTH: [0.7, 2.4, 3, 1, 1.2, 1],
  SPACING: 0.2,
};

export const INDEX_REPORT_TITLE = 5;
export const HEIGHT_REPORT_TITLE = 36.75;
export const INDEX_REPORT_TIME = 6;
export const KEY_COLUMN = 'child';
export const ROW_WHEN_HAVE_HEADER = 8;
export const ROW_WHEN_NOT_HAVE_HEADER = 1;
