import { TableDataSituationImportPeriod } from '@models/situation_import.model';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_CENTER_BOTTOM,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  FONT_BOLD_8,
  FONT_NORMAL_9,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { configCells, ConfigCells } from '../report-excel.layout';
export function reportSituationImportPeriodTemplateData(
  curRowIdx: number,
  worksheet: ExcelJS.Worksheet,
  dataExcell: TableDataSituationImportPeriod[],
  cellAligment: any,
  i18n: I18nRequestScopeService,
) {
  if (dataExcell.length > 0) {
    const cells: ConfigCells[] = [];
    let totalPrice = 0;
    dataExcell.forEach((item) => {
      totalPrice += item.totalPrice;
      cells.push(
        ...[
          {
            nameCell: `A${curRowIdx}:Q${curRowIdx}`,
            value: item.warehouseCode,
            font: FONT_BOLD_8,
            aligment: ALIGNMENT_LEFT,
            border: BORDER,
            merge: true,
            heightRow: {
              index: curRowIdx,
              value: 25,
            },
          },
          {
            nameCell: `R${curRowIdx}`,
            border: BORDER,
          },
          {
            nameCell: `S${curRowIdx}`,
            value: item.totalPrice ? item.totalPrice : '0',
            font: FONT_BOLD_8,
            aligment: ALIGNMENT_RIGHT,
            numFmt: '### ### ### ###',
            border: BORDER,
          },
        ],
      );
      curRowIdx++;
      item.reasons.forEach((reason) => {
        cells.push(
          ...[
            {
              nameCell: `A${curRowIdx}:Q${curRowIdx}`,
              value: i18n.translate('report.REASON') + reason.value,
              font: FONT_BOLD_8,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
              merge: true,
              heightRow: {
                index: curRowIdx,
                value: 25,
              },
            },
            {
              nameCell: `R${curRowIdx}`,
              border: BORDER,
            },
            {
              nameCell: `S${curRowIdx}`,
              border: BORDER,
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
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER,
              },
              {
                nameCell: `B${curRowIdx}`,
                value: order.orderCode,
                border: BORDER,
                font: FONT_BOLD_8,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `C${curRowIdx}`,
                value: order.orderCreatedAt,
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER,
              },
              {
                nameCell: `D${curRowIdx}`,
                value: order.contract,
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `E${curRowIdx}`,
                value: order.constructionName,
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `F${curRowIdx}`,
                value: order.providerName,
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `G${curRowIdx}`,
                value: order.departmentReceiptName,
                border: BORDER,
                font: FONT_NORMAL_9,
              },
              {
                nameCell: `H${curRowIdx}:Q${curRowIdx}`,
                value: order.explain,
                border: BORDER,
                font: FONT_NORMAL_9,
                merge: true,
              },
              {
                nameCell: `S${curRowIdx}`,
                value: order.totalPrice ? order.totalPrice : '0',
                border: BORDER,
                font: FONT_NORMAL_9,
                numFmt: '### ### ### ###',
                aligment: ALIGNMENT_RIGHT,
              },
            ],
          );

          curRowIdx++;
          order.items.forEach((item) => {
            cells.push(
              ...[
                {
                  nameCell: `A${curRowIdx}:G${curRowIdx}`,
                  border: BORDER,
                  merge: true,
                },
                {
                  nameCell: `H${curRowIdx}:I${curRowIdx}`,
                  value: item.itemCode,
                  font: FONT_BOLD_8,
                  aligment: ALIGNMENT_LEFT,
                  border: BORDER,
                  merge: true,
                },
                {
                  nameCell: `J${curRowIdx}`,
                  value: item.itemName,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_LEFT,
                  border: BORDER,
                },
                {
                  nameCell: `K${curRowIdx}`,
                  value: item.lotNumber,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER,
                  border: BORDER,
                },
                {
                  nameCell: `L${curRowIdx}`,
                  value: item.accountDebt,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `M${curRowIdx}`,
                  value: item.accountHave,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                  numFmt: '### ### ### ###',
                },
                {
                  nameCell: `M${curRowIdx}`,
                  value: item.accountHave,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                  numFmt: '###,###,###,###,###,###,###,###',
                },
                {
                  nameCell: `N${curRowIdx}`,
                  value: item.unit,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER,
                  border: BORDER,
                },
                {
                  nameCell: `O${curRowIdx}`,
                  value: item.actualQuantity,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER,
                  border: BORDER,
                },
                {
                  nameCell: `P${curRowIdx}`,
                  value: item.locatorCode,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_LEFT,
                  border: BORDER,
                },
                {
                  nameCell: `Q${curRowIdx}`,
                  value: item.storageCost,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `R${curRowIdx}`,
                  value: '',
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `S${curRowIdx}`,
                  value: item.totalPrice ? item.totalPrice : '0',
                  font: FONT_BOLD_8,
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
    });
    cells.push(
      ...[
        {
          nameCell: `A${curRowIdx}:Q${curRowIdx}`,
          value: i18n.translate('report.TOTAL'),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_CENTER,
          border: BORDER,
          merge: true,
        },
        {
          nameCell: `R${curRowIdx}`,
          value: 0,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
        },
        {
          nameCell: `S${curRowIdx}`,
          value: totalPrice,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ### ###',
        },
      ],
    );
    configCells(worksheet, i18n, cells);
    curRowIdx++;
  }
  return curRowIdx;
}
