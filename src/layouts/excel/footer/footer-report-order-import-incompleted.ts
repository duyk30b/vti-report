import { ALIGNMENT_CENTER, FONT_BOLD_9, FONT_ITALIC_9 } from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { configCells, ConfigCells } from '../report-excel.layout';

export function footerReportOrderImportIncompleted(
  curRowIdx: number,
  worksheet: ExcelJS.Worksheet,
  i18n: I18nRequestScopeService,
  companyCode: string,
) {
  curRowIdx++;
  const cells: ConfigCells[] = [];
  cells.push(
    ...[
      {
        nameCell: `K${curRowIdx}:L${curRowIdx}`,
        value: `${companyCode}_REPORT_FOOTER_DATE`,
        font: FONT_ITALIC_9,
        aligment: ALIGNMENT_CENTER,
        merge: true,
        translate: true,
      },
    ],
  );
  curRowIdx++;
  cells.push(
    ...[
      {
        nameCell: `C${curRowIdx + 1}`,
        value: 'REPORT_FOOTER_SCHEDULER',
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_CENTER,
        translate: true,
      },
      {
        nameCell: `K${curRowIdx + 1}`,
        value: 'REPORT_FOOTER_STOCKER',
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_CENTER,
        merge: true,
        translate: true,
      },
    ],
  );
  configCells(worksheet, i18n, cells);
}