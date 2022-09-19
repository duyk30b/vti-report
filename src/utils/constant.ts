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

export const FONT_BOLD_8 = {
  name: FONT_NAME,
  color: { argb: COLOR },
  bold: true,
  size: 8,
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
// W001	Báo cáo thống kê phiếu nhập kho chưa nhập kho trên EBS	Chưa_NK_EBS
// W002	Báo cáo vật tư đã nhập kho chưa cất vào vị trí	NK_chưa cất
// W003	Báo cáo phiếu xuất kho chưa xuất kho trên EBS	Chưa_XK_EBS
// W004	Báo cáo phiếu chuyển kho chưa chuyển kho trên EBS	Chưa_CK_EBS
// W005	Báo cáo hàng tồn kho dưới mức tồn kho an toàn	Tồn_dưới_mức_an_toàn
// W006	Báo cáo hàng tồn kho dưới dưới mức tồn kho tối thiểu	Tồn_dưới_mức_tối_thiểu
// W007	Thống kê tồn kho	Thống_kê_tồn
// W008	Thống kê đơn nhập kho theo yêu cầu cấp vật tư	NK_theo_yêu_cầu
// W009	Thống kê tuổi hàng tồn kho	Thống_kê_tuổi_hàng_tồn
// W010	Báo cáo vật tư tồn kho	Báo_cáo_tồn
// W011	Thống kê tình hình nhập kho	Thống_kê_NK
// W012	Thống kê tình hình xuất kho	Thống_kê_XK
// W013	Thông kê tình hình chuyển kho	Thống_kê_CK
// W014	Thống kê tình hình kiểm kê theo kỳ	Thống_kê_kiểm_kê
// W015	Thống kê vật tư đã được nhập kho nhưng chưa được in mã QR code	NK_chưa_in_QRcode
// W016	Thống kê  vật tư xuất kho theo giấy đề nghị xuất vật tư	XK_theo_ĐNXK

// "REPORT_ITEM_INVENTORY_BELOW_MINIMUM": {
//   "TITLE": "BÁO CÁO HÀNG TỒN KHO DƯỚI MỨC TỒN KHO TỐI THIỂU\n{property}",
//   "FILE_NAME": "W006-Báo cáo hàng tồn kho dưới mức tồn kho tối thiểu_{property}",
//   "SHEET_NAME": "W006-Tồn_dưới_mức_tối_thiểu_{property}"
// },
// "ITEM_INVENTORY_BELOW_SAFE": {
//   "TITLE": "BÁO CÁO HÀNG TỒN KHO DƯỚI MỨC TỒN KHO AN TOÀN\n{property}",
//   "FILE_NAME": "W005-Báo cáo hàng tồn kho dưới mức tồn kho an toàn_{property}",
//   "SHEET_NAME": "W005-Tồn_dưới_mức_an_toàn_{property}"
// },
// "ORDER_TRANSFER_INCOMPLETED": {
//   "TITLE": "BÁO CÁO PHIẾU CHUYỂN KHO CHƯA CHUYỂN KHO TRÊN EBS\n{property}",
//   "FILE_NAME": "W004-Báo cáo phiếu chuyển kho chưa chuyển kho_{property}",
//   "SHEET_NAME": "W004-Chưa_CK_EBS_{property}"
// },
// "ORDER_EXPORT_INCOMPLETED": {
//   "TITLE": "BÁO CÁO PHIẾU XUẤT KHO CHƯA XUẤT KHO TRÊN EBS\n{property}",
//   "FILE_NAME": "W003-Báo cáo phiếu xuất kho chưa xuất kho trên EBS_{property}",
//   "SHEET_NAME": "W003-Chưa_XK_EBS{property}"
// },
// "ORDER_IMPORT_INCOMPLETED": {
//   "TITLE": "BÁO CÁO THỐNG KÊ PHIẾU NHẬP KHO CHƯA NHẬP KHO TRÊN EBS\n{property}",
//   "FILE_NAME": "W001-Báo cáo thống kê phiếu nhập kho chưa nhập kho trên EBS_{property}",
//   "SHEET_NAME": "W001-Chưa_NK_EBS{property}"
// },
// "ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION": {
//   "TITLE": "BÁO CÁO THỐNG KÊ PHIẾU NHẬP KHO CHƯA NHẬP KHO TRÊN EBS\n{property}",
//   "FILE_NAME": "W001-Báo cáo thống kê phiếu nhập kho chưa nhập kho trên EBS_{property}",
//   "SHEET_NAME": "W001-Chưa_NK_EBS{property}"
// }

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

export const STATUS_IMPORT = {
  [OrderStatus[OrderStatus.IMPORTING]]: {
    value: 'Đang nhập kho',
  },
  [OrderStatus[OrderStatus.IMPORTED]]: {
    value: 'Đã nhập kho',
  },
  [OrderStatus[OrderStatus.IMPORT_INCOMPLETED]]: {
    value: 'Chưa nhập kho',
  },
};

export const MONTHS = 'months';
export const YEARS = 'years';
