import { formatMoney } from '@constant/common';
import { TableDataSituationImportPeriod } from '@models/situation_import.model';
import { plusBigNumber } from '@utils/common';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  FONT_BOLD_9,
  FONT_NORMAL_9,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import * as moment from 'moment';
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
      totalPrice = plusBigNumber(totalPrice, item.totalPrice || 0);
      cells.push(
        ...[
          {
            nameCell: `A${curRowIdx}:R${curRowIdx}`,
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
            nameCell: `S${curRowIdx}`,
            border: BORDER,
          },
          {
            nameCell: `T${curRowIdx}`,
            value: item.totalPrice
              ? formatMoney(Math.round(item.totalPrice))
              : '0',
            font: FONT_NORMAL_9,
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
              nameCell: `A${curRowIdx}:R${curRowIdx}`,
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
              nameCell: `S${curRowIdx}`,
              border: BORDER,
            },
            {
              nameCell: `T${curRowIdx}`,
              value: formatMoney(Math.round(reason?.totalPrice || 0)) || '0',
              border: BORDER,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_RIGHT,
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
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `C${curRowIdx}`,
                value: order.ebsNumber || '',
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER,
              },
              {
                nameCell: `D${curRowIdx}`,
                value: moment(order.orderCreatedAt).format('DD/MM/YYYY') || '',
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER,
              },
              {
                nameCell: `E${curRowIdx}`,
                value: order.contract,
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `F${curRowIdx}`,
                value: order.constructionName,
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `G${curRowIdx}`,
                value: order.providerName,
                border: BORDER,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `H${curRowIdx}`,
                value: order.departmentReceiptName,
                border: BORDER,
                font: FONT_NORMAL_9,
              },
              {
                nameCell: `I${curRowIdx}:S${curRowIdx}`,
                value: order.explain,
                border: BORDER,
                font: FONT_NORMAL_9,
                merge: true,
              },
              {
                nameCell: `T${curRowIdx}`,
                value: order.totalPrice ? formatMoney(order.totalPrice) : '0',
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
                  nameCell: `A${curRowIdx}:H${curRowIdx}`,
                  border: BORDER,
                  merge: true,
                },
                {
                  nameCell: `I${curRowIdx}:J${curRowIdx}`,
                  value: item.itemCode,
                  font: FONT_BOLD_9,
                  aligment: ALIGNMENT_LEFT,
                  border: BORDER,
                  merge: true,
                },
                {
                  nameCell: `K${curRowIdx}`,
                  value: item.itemName,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_LEFT,
                  border: BORDER,
                },
                {
                  nameCell: `L${curRowIdx}`,
                  value: item.lotNumber,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER,
                  border: BORDER,
                },
                {
                  nameCell: `M${curRowIdx}`,
                  value: item.accountDebt,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `N${curRowIdx}`,
                  value: item.accountHave,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `O${curRowIdx}`,
                  value: item.unit,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER,
                  border: BORDER,
                },
                {
                  nameCell: `P${curRowIdx}`,
                  value: formatMoney(item.actualQuantity, 2),
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER,
                  border: BORDER,
                  numFmt: '### ### ### ###',
                },
                {
                  nameCell: `Q${curRowIdx}`,
                  value: item.locatorCode,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_LEFT,
                  border: BORDER,
                },
                {
                  nameCell: `R${curRowIdx}`,
                  value: formatMoney(item.storageCost, 2),
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `S${curRowIdx}`,
                  value: '',
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `T${curRowIdx}`,
                  value: formatMoney(item.totalPrice),
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
    });
    cells.push(
      ...[
        {
          nameCell: `A${curRowIdx}:R${curRowIdx}`,
          value: i18n.translate('report.TOTAL'),
          font: FONT_BOLD_9,
          aligment: ALIGNMENT_CENTER,
          border: BORDER,
          merge: true,
        },
        {
          nameCell: `S${curRowIdx}`,
          value: 0,
          font: FONT_BOLD_9,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
        },
        {
          nameCell: `T${curRowIdx}`,
          value: formatMoney(totalPrice),
          font: FONT_NORMAL_9,
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
