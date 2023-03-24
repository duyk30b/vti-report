import { formatMoney, readDecimal } from '@constant/common';
import { TableAgeOfItems } from '@models/age-of-items.model';
import { plusBigNumber } from '@utils/common';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  FONT_BOLD_8,
  FONT_BOLD_9,
  FONT_NORMAL_9,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { configCells, ConfigCells } from '../report-excel.layout';
export function reportAgeOfItemsTemplateData(
  curRowIdx: number,
  worksheet: ExcelJS.Worksheet,
  dataExcell: TableAgeOfItems[],
  _alignment: any,
  i18n: I18nRequestScopeService,
) {
  let totalPriceAll = 0;
  let totalSixMonthAll = 0;
  let totalOneYearAll = 0;
  let totalTwoYearAll = 0;
  let totalThreeYearAll = 0;
  let totalFourYearAll = 0;
  let totalFiveYearAll = 0;
  let totalGreaterFiveYearAll = 0;
  const cells: ConfigCells[] = [];
  dataExcell.forEach((warehouse) => {
    totalPriceAll = plusBigNumber(warehouse.totalPrice, totalPriceAll);
    totalSixMonthAll = plusBigNumber(warehouse.sixMonth, totalSixMonthAll);
    totalOneYearAll = plusBigNumber(warehouse.oneYearAgo, totalOneYearAll);
    totalTwoYearAll = plusBigNumber(warehouse.twoYearAgo, totalTwoYearAll);
    totalThreeYearAll = plusBigNumber(
      warehouse.threeYearAgo,
      totalThreeYearAll,
    );
    totalFourYearAll = plusBigNumber(warehouse.fourYearAgo, totalFourYearAll);
    totalFiveYearAll = plusBigNumber(warehouse.fiveYearAgo, totalFiveYearAll);
    totalGreaterFiveYearAll = plusBigNumber(
      warehouse.greaterfiveYear,
      totalGreaterFiveYearAll,
    );
    cells.push(
      ...[
        {
          nameCell: `A${curRowIdx}:J${curRowIdx}`,
          value: warehouse.warehouseCode,
          font: FONT_BOLD_9,
          aligment: ALIGNMENT_LEFT,
          border: BORDER,
          merge: true,
        },
        {
          nameCell: `K${curRowIdx}`,
          value: formatMoney(warehouse.totalPrice),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `L${curRowIdx}`,
          value: formatMoney(warehouse.sixMonth),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `M${curRowIdx}`,
          value: formatMoney(warehouse.oneYearAgo),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `N${curRowIdx}`,
          value: formatMoney(warehouse.twoYearAgo),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `O${curRowIdx}`,
          value: formatMoney(warehouse.threeYearAgo),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `P${curRowIdx}`,
          value: formatMoney(warehouse.fourYearAgo),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `Q${curRowIdx}`,
          value: formatMoney(warehouse.fiveYearAgo),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `R${curRowIdx}`,
          value: formatMoney(warehouse.greaterfiveYear),
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
      ],
    );
    curRowIdx++;
    warehouse.items.forEach((item) => {
      cells.push(
        ...[
          {
            nameCell: `A${curRowIdx}`,
            value: item.itemCode,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_LEFT,
            border: BORDER,
          },
          {
            nameCell: `B${curRowIdx}:H${curRowIdx}`,
            value: item.itemName,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_LEFT,
            border: BORDER,
            merge: true,
          },
          {
            nameCell: `I${curRowIdx}`,
            value: readDecimal(item.totalQuantity),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `J${curRowIdx}`,
            border: BORDER,
          },
          {
            nameCell: `K${curRowIdx}`,
            value: formatMoney(item.totalPrice),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `L${curRowIdx}`,
            value: formatMoney(item.sixMonthAgo),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `M${curRowIdx}`,
            value: formatMoney(item.oneYearAgo),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `N${curRowIdx}`,
            value: formatMoney(item.twoYearAgo),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `O${curRowIdx}`,
            value: formatMoney(item.threeYearAgo),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `P${curRowIdx}`,
            value: formatMoney(item.fourYearAgo),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `Q${curRowIdx}`,
            value: formatMoney(item.fiveYearAgo),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `R${curRowIdx}`,
            value: formatMoney(item.greaterfiveYear),
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
        ],
      );
      curRowIdx++;
      item.groupByStorageDate.forEach((order, index) => {
        if (order?.stockQuantity) {
          cells.push(
            ...[
              {
                nameCell: `A${curRowIdx}`,
                border: BORDER,
              },
              {
                nameCell: `B${curRowIdx}`,
                border: BORDER,
              },
              {
                nameCell: `C${curRowIdx}`,
                value: order.storageDate || '',
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER,
                border: BORDER,
              },
              {
                nameCell: `D${curRowIdx}`,
                value: order.origin,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
                border: BORDER,
              },
              {
                nameCell: `E${curRowIdx}`,
                value: order.account,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_LEFT,
                border: BORDER,
              },
              {
                nameCell: `F${curRowIdx}`,
                value: order.lotNumber,
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_CENTER,
                border: BORDER,
              },
              {
                nameCell: `G${curRowIdx}`,
                value: order.locatorCode,
                font: FONT_NORMAL_9,
                border: BORDER,
                aligment: ALIGNMENT_LEFT,
              },
              {
                nameCell: `H${curRowIdx}`,
                value: order.unit,
                font: FONT_NORMAL_9,
                border: BORDER,
                aligment: ALIGNMENT_RIGHT,
              },
              {
                nameCell: `I${curRowIdx}`,
                value: readDecimal(order.stockQuantity),
                font: FONT_NORMAL_9,
                border: BORDER,
                aligment: ALIGNMENT_RIGHT,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `J${curRowIdx}`,
                value: readDecimal(order.storageCost),
                font: FONT_NORMAL_9,
                border: BORDER,
                aligment: ALIGNMENT_RIGHT,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `K${curRowIdx}`,
                value: formatMoney(order.totalPrice),
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_RIGHT,
                numFmt: '### ### ### ###',
                border: BORDER,
              },
              {
                nameCell: `L${curRowIdx}`,
                value: formatMoney(order.sixMonthAgo),
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `M${curRowIdx}`,
                value: formatMoney(order.oneYearAgo),
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `N${curRowIdx}`,
                value: formatMoney(order.twoYearAgo),
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `O${curRowIdx}`,
                value: formatMoney(order.threeYearAgo),
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `P${curRowIdx}`,
                value: formatMoney(order.fourYearAgo),
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `Q${curRowIdx}`,
                value: formatMoney(order.fiveYearAgo),
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `R${curRowIdx}`,
                value: formatMoney(order.greaterfiveYear),
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
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
  cells.push(
    ...[
      {
        nameCell: `A${curRowIdx}:J${curRowIdx}`,
        value: 'TOTAL',
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        merge: true,
        translate: true,
      },
      {
        nameCell: `K${curRowIdx}`,
        value: formatMoney(totalPriceAll),
        font: FONT_NORMAL_9,
        aligment: ALIGNMENT_RIGHT,
        numFmt: '### ### ### ###',
        border: BORDER,
      },
      {
        nameCell: `L${curRowIdx}`,
        value: formatMoney(totalSixMonthAll),
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `M${curRowIdx}`,
        value: formatMoney(totalOneYearAll),
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `N${curRowIdx}`,
        value: formatMoney(totalTwoYearAll),
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `O${curRowIdx}`,
        value: formatMoney(totalThreeYearAll),
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `P${curRowIdx}`,
        value: formatMoney(totalFourYearAll),
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `Q${curRowIdx}`,
        value: formatMoney(totalFiveYearAll),
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `R${curRowIdx}`,
        value: formatMoney(totalGreaterFiveYearAll),
        font: FONT_BOLD_9,
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
