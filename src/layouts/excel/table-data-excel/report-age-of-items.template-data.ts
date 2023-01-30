import { formatDate, readDecimal } from '@constant/common';
import { TableAgeOfItems } from '@models/age-of-items.model';
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
    totalPriceAll += warehouse.totalPrice;
    totalSixMonthAll += warehouse.sixMonth;
    totalOneYearAll += warehouse.oneYearAgo;
    totalTwoYearAll += warehouse.twoYearAgo;
    totalThreeYearAll += warehouse.threeYearAgo;
    totalFourYearAll += warehouse.fourYearAgo;
    totalFiveYearAll += warehouse.fiveYearAgo;
    totalGreaterFiveYearAll += warehouse.greaterfiveYear;
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
          value: warehouse.totalPrice,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `L${curRowIdx}`,
          value: warehouse.sixMonth,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `M${curRowIdx}`,
          value: warehouse.oneYearAgo,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `N${curRowIdx}`,
          value: warehouse.twoYearAgo,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `O${curRowIdx}`,
          value: warehouse.threeYearAgo,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `P${curRowIdx}`,
          value: warehouse.fourYearAgo,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `Q${curRowIdx}`,
          value: warehouse.fiveYearAgo,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `R${curRowIdx}`,
          value: warehouse.greaterfiveYear,
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
            value: item.totalPrice,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `K${curRowIdx}`,
            value: item.totalPrice,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `L${curRowIdx}`,
            value: item.sixMonthAgo,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `M${curRowIdx}`,
            value: item.oneYearAgo,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `N${curRowIdx}`,
            value: item.twoYearAgo,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `O${curRowIdx}`,
            value: item.threeYearAgo,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `P${curRowIdx}`,
            value: item.fourYearAgo,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `Q${curRowIdx}`,
            value: item.fiveYearAgo,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_RIGHT,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `R${curRowIdx}`,
            value: item.greaterfiveYear,
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
                value: readDecimal(order.totalPrice),
                font: FONT_NORMAL_9,
                aligment: ALIGNMENT_RIGHT,
                numFmt: '### ### ### ###',
                border: BORDER,
              },
              {
                nameCell: `L${curRowIdx}`,
                value: order.sixMonthAgo,
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `M${curRowIdx}`,
                value: order.oneYearAgo,
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `N${curRowIdx}`,
                value: order.twoYearAgo,
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `O${curRowIdx}`,
                value: order.threeYearAgo,
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `P${curRowIdx}`,
                value: order.fourYearAgo,
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `Q${curRowIdx}`,
                value: order.fiveYearAgo,
                font: FONT_BOLD_9,
                aligment: ALIGNMENT_RIGHT,
                border: BORDER,
                numFmt: '### ### ### ###',
              },
              {
                nameCell: `R${curRowIdx}`,
                value: order.greaterfiveYear,
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
        value: readDecimal(totalPriceAll),
        font: FONT_NORMAL_9,
        aligment: ALIGNMENT_RIGHT,
        numFmt: '### ### ### ###',
        border: BORDER,
      },
      {
        nameCell: `L${curRowIdx}`,
        value: totalSixMonthAll,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `M${curRowIdx}`,
        value: totalOneYearAll,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `N${curRowIdx}`,
        value: totalTwoYearAll,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `O${curRowIdx}`,
        value: totalThreeYearAll,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `P${curRowIdx}`,
        value: totalFourYearAll,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `Q${curRowIdx}`,
        value: totalFiveYearAll,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_RIGHT,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `R${curRowIdx}`,
        value: totalGreaterFiveYearAll,
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
