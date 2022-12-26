import { TableDataSituationExportPeriod } from '@models/situation_export.model';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_CENTER_BOTTOM,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  BORDER_T_R_B,
  FONT_BOLD_9,
  FONT_NORMAL_9,
  BORDER_T_L_B,
  ALIGNMENT_BOTTOM_LEFT,
  ALIGNMENT_BOTTOM_RIGHT,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { configCells, ConfigCells } from '../report-excel.layout';
export function reportSituationExportPeriodTemplateData(
  curRowIdx: number,
  worksheet: ExcelJS.Worksheet,
  dataExcell: TableDataSituationExportPeriod[],
  _alignment: any,
  i18n: I18nRequestScopeService,
) {
  let totalPriceAll = 0;
  const cells: ConfigCells[] = [];
  dataExcell.forEach((item) => {
    totalPriceAll += item.totalPrice;
    cells.push(
      ...[
        {
          nameCell: `A${curRowIdx}:K${curRowIdx}`,
          value: item.warehouseCode,
          font: FONT_BOLD_9,
          aligment: ALIGNMENT_LEFT,
          border: BORDER,
          merge: true,
          heightRow: {
            index: curRowIdx,
            value: 25,
          },
        },
        {
          nameCell: `L${curRowIdx}:Q${curRowIdx}`,
          value: item.totalPrice || '0',
          font: FONT_BOLD_9,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          merge: true,
          numFmt: '### ### ### ###',
        },
      ],
    );
    curRowIdx++;
    item.reasons.forEach((reason) => {
      cells.push(
        ...[
          {
            nameCell: `A${curRowIdx}:K${curRowIdx}`,
            value: i18n.translate('report.REASON') + reason.value,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_LEFT,
            border: BORDER,
            merge: true,
            heightRow: {
              index: curRowIdx,
              value: 25,
            },
          },
          {
            nameCell: `L${curRowIdx}:Q${curRowIdx}`,
            value: reason.totalPrice || '0',
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            merge: true,
            numFmt: '### ### ### ###',
          },
        ],
      );
      curRowIdx++;
      reason.orders.forEach((order, index) => {
        cells.push(
          ...[
            {
              nameCell: `A${curRowIdx}`,
              value: index + 1,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_CENTER,
              border: BORDER,
            },
            {
              nameCell: `B${curRowIdx}`,
              value: order.orderCode,
              font: FONT_BOLD_9,
              aligment: ALIGNMENT_LEFT,
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
              nameCell: `D${curRowIdx}`,
              value: order.constructionName,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `E${curRowIdx}`,
              value: order.departmentReceiptName,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `F${curRowIdx}:K${curRowIdx}`,
              value: order.explain,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
              merge: true,
            },
            {
              nameCell: `N${curRowIdx}`,
              value: order.totalPrice || 0,
              font: FONT_BOLD_9,
              aligment: ALIGNMENT_LEFT,
              numFmt: '### ### ### ### ',
            },
            {
              nameCell: `N${curRowIdx}:Q${curRowIdx}`,
              merge: true,
              border: BORDER_T_R_B,
            },
            {
              nameCell: `L${curRowIdx}:M${curRowIdx}`,
              merge: true,
              border: BORDER_T_L_B,
            },
          ],
        );
        curRowIdx++;

        order.items.forEach((item) => {
          cells.push(
            ...[
              {
                nameCell: `A${curRowIdx}:E${curRowIdx}`,
                border: BORDER,
                merge: true,
                heightRow: {
                  index: curRowIdx,
                  value: 30,
                },
              },
              {
                nameCell: `F${curRowIdx}:G${curRowIdx}`,
                value: item.itemCode,
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_BOTTOM_LEFT,
                border: BORDER,
                merge: true,
              },
              {
                nameCell: `H${curRowIdx}`,
                value: item.itemName,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_LEFT,
                border: BORDER,
              },
              {
                nameCell: `I${curRowIdx}`,
                value: item.lotNumber,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER,
                border: BORDER,
              },
              {
                nameCell: `J${curRowIdx}`,
                value: item.accountDebt,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_LEFT,
                border: BORDER,
              },
              {
                nameCell: `K${curRowIdx}`,
                value: item.accountHave,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_LEFT,
                border: BORDER,
              },
              {
                nameCell: `L${curRowIdx}`,
                value: item.unit,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER_BOTTOM,
                border: BORDER,
              },
              {
                nameCell: `M${curRowIdx}`,
                value: item.planQuantity,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ### ',
              },
              {
                nameCell: `N${curRowIdx}`,
                value: item.actualQuantity,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `O${curRowIdx}`,
                value: item.locatorCode,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_RIGHT,
                border: BORDER,
              },
              {
                nameCell: `P${curRowIdx}`,
                value: item.storageCost || 0,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `Q${curRowIdx}`,
                value: item.totalPrice || 0,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_BOTTOM_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
            ],
          );
          curRowIdx++;
        });
      });
    });
  });

  cells.push(
    ...[
      {
        nameCell: `A${curRowIdx}:K${curRowIdx}`,
        value: 'TOTAL',
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_CENTER,
        border: BORDER,
        merge: true,
        translate: true,
      },
      {
        nameCell: `L${curRowIdx}:Q${curRowIdx}`,
        value: totalPriceAll,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        merge: true,
      },
    ],
  );
  configCells(worksheet, i18n, cells);

  curRowIdx++;
  return curRowIdx;
}
