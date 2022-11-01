import { Alignment, FormatByKey, TableData } from '@models/report.model';
import {
  ALIGNMENT_BOTTOM,
  ALIGNMENT_CENTER,
  ALIGNMENT_CENTER_LEFT,
  ALIGNMENT_CENTER_RIGHT,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  BORDER_R,
  BORDER_T_L_B,
  CELL_A,
  COLUMN_COLOR,
  EXCEL_COLUMN,
  FONT_BOLD_8,
  FONT_BOLD_9,
  FONT_NORMAL_9,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';

export function reportGroupByWarehouseTemplateData(
  rowIdx: number,
  worksheet: ExcelJS.Worksheet,
  data: TableData<any>[],
  format?: FormatByKey<any>,
) {
  data.forEach((warehouseData: any) => {
    const endColumn = `${
      EXCEL_COLUMN[worksheet['columnNumber_'] - 2]
    }${rowIdx}`;
    const cellGroupByWarehouse = worksheet.getCell(
      `${CELL_A}${rowIdx}:${endColumn}`,
    );
    worksheet.mergeCells(`${CELL_A}${rowIdx}:${endColumn}`);
    cellGroupByWarehouse.value = warehouseData.warehouseCode;
    cellGroupByWarehouse.font = FONT_BOLD_9;
    cellGroupByWarehouse.alignment = ALIGNMENT_LEFT as any;
    cellGroupByWarehouse.border = BORDER as any;
    rowIdx++;
    warehouseData.data.forEach((item: any, indexData) => {
      Object.keys(item).forEach((key: any, indexKey) => {
        const currenCell = worksheet.getCell(
          `${EXCEL_COLUMN[indexKey] + rowIdx}`,
        );
        currenCell.value = item[key];
        if (key === 'index') {
          currenCell.value = indexData + 1;
        }
        currenCell.font = FONT_NORMAL_9;
        currenCell.border = BORDER as any;

        if (format)
          switch (format[key]) {
            case Alignment.CENTER:
              currenCell.alignment = ALIGNMENT_CENTER as any;
              break;

            case Alignment.LEFT:
              currenCell.alignment = ALIGNMENT_LEFT as any;
              break;

            case Alignment.RIGHT:
              currenCell.alignment = ALIGNMENT_RIGHT as any;
              break;

            case Alignment.BOTTOM:
              currenCell.alignment = ALIGNMENT_BOTTOM as any;
              break;

            case Alignment.CENTER_LEFT:
              currenCell.alignment = ALIGNMENT_CENTER_LEFT as any;
              break;

            case Alignment.CENTER_RIGHT:
              currenCell.alignment = ALIGNMENT_CENTER_RIGHT as any;
              break;

            default:
              break;
          }
      });
      rowIdx++;
    });
  });
  return rowIdx;
}
