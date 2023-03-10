import { formatMoney, readDecimal } from '@constant/common';
import { TableDataSituationExportPeriod } from '@models/situation_export.model';
import { plusBigNumber } from '@utils/common';
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
  FORMAT_DATE_EXCEL,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { configCells, ConfigCells } from '../report-excel.layout';
import * as moment from 'moment';
import { isEmpty } from 'lodash';
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
    totalPriceAll = plusBigNumber(totalPriceAll, item.totalPrice || 0);
    cells.push(
      ...[
        {
          nameCell: `A${curRowIdx}:L${curRowIdx}`,
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
          nameCell: `M${curRowIdx}:R${curRowIdx}`,
          value: formatMoney(item.totalPrice) || '0',
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
            nameCell: `A${curRowIdx}:L${curRowIdx}`,
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
            nameCell: `M${curRowIdx}:R${curRowIdx}`,
            value: formatMoney(reason.totalPrice) || '0',
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
        const ebsId = order?.ebsNumber.split('\n')[0] || '';
        const transactionNumberCreated = order?.ebsNumber.split('\n')[1] || '';
        let ebsNumber = '';
        if (!isEmpty(transactionNumberCreated) && !isEmpty(ebsId)) {
          ebsNumber = order.ebsNumber;
        } else if (isEmpty(transactionNumberCreated)) ebsNumber = ebsId;
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
              value: ebsNumber || '',
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_CENTER,
              border: BORDER,
            },
            {
              nameCell: `D${curRowIdx}`,
              value:
                moment(order.orderCreatedAt).format(FORMAT_DATE_EXCEL) || '',
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_CENTER,
              border: BORDER,
            },
            {
              nameCell: `E${curRowIdx}`,
              value: order.constructionName,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `F${curRowIdx}`,
              value: order.departmentReceiptName,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
            },
            {
              nameCell: `G${curRowIdx}:L${curRowIdx}`,
              value: order.explain,
              font: FONT_NORMAL_9,
              aligment: ALIGNMENT_LEFT,
              border: BORDER,
              merge: true,
            },
            {
              nameCell: `O${curRowIdx}`,
              value: formatMoney(order.totalPrice) || '0',
              font: FONT_BOLD_9,
              aligment: ALIGNMENT_RIGHT,
              numFmt: '### ### ### ### ',
            },
            {
              nameCell: `O${curRowIdx}:R${curRowIdx}`,
              merge: true,
              border: BORDER_T_R_B,
            },
            {
              nameCell: `M${curRowIdx}:N${curRowIdx}`,
              merge: true,
              border: BORDER_T_L_B,
            },
          ],
        );
        curRowIdx++;

        order.items.forEach((item) => {
          if (item.actualQuantity) {
            cells.push(
              ...[
                {
                  nameCell: `A${curRowIdx}:F${curRowIdx}`,
                  border: BORDER,
                  merge: true,
                  heightRow: {
                    index: curRowIdx,
                    value: 30,
                  },
                },
                {
                  nameCell: `G${curRowIdx}:H${curRowIdx}`,
                  value: item.itemCode,
                  font: FONT_BOLD_9,
                  aligment: ALIGNMENT_BOTTOM_LEFT,
                  border: BORDER,
                  merge: true,
                },
                {
                  nameCell: `I${curRowIdx}`,
                  value: item.itemName,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_LEFT,
                  border: BORDER,
                },
                {
                  nameCell: `J${curRowIdx}`,
                  value: item.lotNumber,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER,
                  border: BORDER,
                },
                {
                  nameCell: `K${curRowIdx}`,
                  value: item.accountDebt + '.',
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_LEFT,
                  border: BORDER,
                },
                {
                  nameCell: `L${curRowIdx}`,
                  value: item.accountHave,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_LEFT,
                  border: BORDER,
                },
                {
                  nameCell: `M${curRowIdx}`,
                  value: item.unit,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_CENTER_BOTTOM,
                  border: BORDER,
                },
                {
                  nameCell: `N${curRowIdx}`,
                  value: readDecimal(item.planQuantity, true),
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_RIGHT,
                  border: BORDER,
                  numFmt: '### ### ### ### ',
                },
                {
                  nameCell: `O${curRowIdx}`,
                  value: readDecimal(item.actualQuantity, true),
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_RIGHT,
                  border: BORDER,
                  numFmt: '### ### ### ###',
                },
                {
                  nameCell: `P${curRowIdx}`,
                  value: item.locatorCode,
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_RIGHT,
                  border: BORDER,
                },
                {
                  nameCell: `Q${curRowIdx}`,
                  value: formatMoney(item.storageCost, 2) || '0,00',
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_RIGHT,
                  border: BORDER,
                  numFmt: '### ### ### ###',
                },
                {
                  nameCell: `R${curRowIdx}`,
                  value: formatMoney(item.totalPrice) || '0',
                  font: FONT_NORMAL_9,
                  aligment: ALIGNMENT_BOTTOM_RIGHT,
                  border: BORDER,
                  numFmt: '### ### ### ###',
                },
              ],
            );
            curRowIdx++;
          }
        });
      });
    });
  });

  cells.push(
    ...[
      {
        nameCell: `A${curRowIdx}:L${curRowIdx}`,
        value: 'TOTAL',
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_CENTER,
        border: BORDER,
        merge: true,
        translate: true,
      },
      {
        nameCell: `M${curRowIdx}:R${curRowIdx}`,
        value: formatMoney(totalPriceAll) || '0',
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
