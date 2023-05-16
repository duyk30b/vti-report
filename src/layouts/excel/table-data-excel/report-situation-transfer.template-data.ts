import { formatMoney } from '@constant/common';
import { TableDataSituationTransfer } from '@models/situation-transfer.model';
import { plusBigNumber } from '@utils/common';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  DATE_FOMAT_EXCELL,
  FONT_BOLD_8,
  FONT_BOLD_9,
  FONT_NORMAL_9,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ConfigCells, configCells } from '../report-excel.layout';
import * as moment from 'moment';
export function reportSituationTransferTemplateData(
  curRowIdx: number,
  worksheet: ExcelJS.Worksheet,
  dataTable: any[],
  cellAligment: any,
  i18n: I18nRequestScopeService,
) {
  const data: TableDataSituationTransfer[] = dataTable;
  let totalQuantity = 0;
  const cells: ConfigCells[] = [];
  data.forEach((item) => {
    cells.push({
      nameCell: `A${curRowIdx}:N${curRowIdx}`,
      value: item.warehouseCode,
      font: FONT_BOLD_9,
      aligment: ALIGNMENT_LEFT,
      translate: false,
      border: BORDER,
      heightRow: { index: curRowIdx, value: 25 },
      merge: true,
    });
    cells.push({
      nameCell: `O${curRowIdx}`,
      value: formatMoney(item.totalPrice) || '0',
      font: FONT_BOLD_8,
      aligment: ALIGNMENT_RIGHT,
      translate: false,
      numFmt: '### ### ### ###',
      border: BORDER,
    });
    curRowIdx++;
    worksheet.getRow(curRowIdx).height = 15;
    item.orders.forEach((order, index) => {
      cells.push(
        ...[
          {
            nameCell: `A${curRowIdx}`,
            value: index + 1,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_CENTER,
            translate: false,
            border: BORDER,
            heightRow: { index: curRowIdx, value: 25 },
          },
          {
            nameCell: `B${curRowIdx}`,
            value: order.orderCode,
            font: FONT_BOLD_8,
            aligment: ALIGNMENT_LEFT,
            translate: false,
            border: BORDER,
          },
          {
            nameCell: `C${curRowIdx}`,
            value: moment(order.orderCreatedAt).format(DATE_FOMAT_EXCELL) || '',
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_CENTER,
            border: BORDER,
          },
          {
            nameCell: `D${curRowIdx}:`,
            value: order.warehouseImport,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_LEFT,
            border: BORDER,
          },
          {
            nameCell: `E${curRowIdx}:N${curRowIdx}`,
            value: order.explain,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_LEFT,
            translate: false,
            border: BORDER,
            merge: true,
          },
          {
            nameCell: `O${curRowIdx}`,
            value: formatMoney(order.totalPrice) || '0',
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
        ],
      );
      curRowIdx++;
      order.items.forEach((row3) => {
        totalQuantity = plusBigNumber(totalQuantity, row3.totalPrice || 0);
        worksheet.mergeCells(`A${curRowIdx}:E${curRowIdx}`);
        cells.push(
          ...[
            {
              nameCell: `A${curRowIdx}:E${curRowIdx}`,
              value: '',
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `F${curRowIdx}`,
              value: row3.itemCode,
              font: FONT_BOLD_8,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `G${curRowIdx}`,
              value: row3.itemName,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `H${curRowIdx}`,
              value: row3.lotNumber,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_CENTER,
              border: BORDER,
            },
            {
              nameCell: `I${curRowIdx}`,
              value: row3.accountDebt,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_RIGHT,
              border: BORDER,
              numFmt: '### ### ### ###',
            },
            {
              nameCell: `J${curRowIdx}`,
              value: row3.accountHave,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_RIGHT,
              border: BORDER,
              numFmt: '### ### ### ###',
            },
            {
              nameCell: `K${curRowIdx}`,
              value: row3.unit,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_CENTER,
              border: BORDER,
            },
            {
              nameCell: `L${curRowIdx}`,
              value: formatMoney(row3.actualQuantity, 2) || '0,00',
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_RIGHT,
              border: BORDER,
              numFmt: '### ### ###,##',
            },
            {
              nameCell: `M${curRowIdx}`,
              value: row3.locatorCode,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `N${curRowIdx}`,
              value: formatMoney(row3.storageCost, 2) || '0,00',
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_RIGHT,
              border: BORDER,
              numFmt: '### ### ###,##',
            },
            {
              nameCell: `O${curRowIdx}`,
              value: formatMoney(row3.totalPrice) || '0',
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_RIGHT,
              border: BORDER,
              numFmt: '### ### ### ###',
            },
          ],
        );
        curRowIdx++;
      });
    });
  });
  cells.push(
    ...[
      {
        nameCell: `A${curRowIdx}:N${curRowIdx}`,
        value: 'TOTAL',
        font: FONT_BOLD_8,
        aligment: ALIGNMENT_CENTER,
        border: BORDER,
        translate: true,
        merge: true,
      },
      {
        nameCell: `O${curRowIdx}`,
        value: formatMoney(totalQuantity) || '0',
        font: FONT_BOLD_8,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
    ],
  );
  configCells(worksheet, i18n, cells);
  curRowIdx++;

  return curRowIdx;
}
