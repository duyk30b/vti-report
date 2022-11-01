import { ALIGNMENT_CENTER, FONT_BOLD_9, FONT_ITALIC_9 } from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { configCells, ConfigCells } from '../report-excel.layout';

export function footerOrderImportIncompleted(
  curRowIdx: number,
  worksheet: ExcelJS.Worksheet,
  i18n: I18nRequestScopeService,
) {
  curRowIdx++;
  const cells: ConfigCells[] = [];
  cells.push(
    ...[
      {
        nameCell: `I${curRowIdx}:K${curRowIdx}`,
        value: 'REPORT_FOOTER_DATE',
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
        nameCell: `E${curRowIdx}`,
        value: 'REPORT_FOOTER_SCHEDULER',
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_CENTER,
        translate: true,
      },
      {
        nameCell: `I${curRowIdx}:K${curRowIdx}`,
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
