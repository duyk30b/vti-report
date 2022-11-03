import { TableDataSituationTransfer } from '@models/situation-transfer.model';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  FONT_BOLD_8,
  FONT_NORMAL_9,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ConfigCells, configCells } from '../report-excel.layout';
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
      font: FONT_BOLD_8,
      aligment: ALIGNMENT_LEFT,
      translate: false,
      border: BORDER,
      heightRow: { index: curRowIdx, value: 25 },
    });
    cells.push({
      nameCell: `O${curRowIdx}`,
      value: item.totalPrice,
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
            value: order.orderCreatedAt,
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
            value: order.totalPrice,
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
        totalQuantity += row3.totalPrice;
        worksheet.mergeCells(`A${curRowIdx}:D${curRowIdx}`);
        worksheet.mergeCells(`E${curRowIdx}:F${curRowIdx}`);
        cells.push(
          ...[
            {
              nameCell: `A${curRowIdx}:D${curRowIdx}`,
              value: '',
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `E${curRowIdx}:F${curRowIdx}`,
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
              value: row3.planQuantity,
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
              value: row3.storageCost,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_RIGHT,
              border: BORDER,
              numFmt: '### ### ###,##',
            },
            {
              nameCell: `O${curRowIdx}`,
              value: row3.totalPrice,
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
        value: totalQuantity,
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
