import { TableDataSituationInventoryPeriod } from '@models/statistic-inventory.model';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_LEFT,
  ALIGNMENT_RIGHT,
  BORDER,
  FONT_BOLD_10,
  FONT_BOLD_8,
  FONT_ITALIC_10,
  FONT_NORMAL_9,
} from '@utils/constant';
import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { configCells, ConfigCells } from '../report-excel.layout';
export function reportSituationInventoryPeriodTemplateData(
  curRowIndex: number,
  worksheet: ExcelJS.Worksheet,
  dataExcell: TableDataSituationInventoryPeriod[],
  _alignment: any,
  i18n: I18nRequestScopeService,
) {
  const cells: ConfigCells[] = [];
  cells.push({
    nameCell: `A${curRowIndex - 4}:P${curRowIndex - 4}`,
    value: 'CURRENCY_DONG',
    font: FONT_ITALIC_10,
    aligment: ALIGNMENT_RIGHT,
    translate: true,
    merge: true,
  });
  let totalAccodingBookG = 0;
  let totalAccodingInventoryG = 0;
  dataExcell.forEach((data) => {
    cells.push({
      nameCell: `A${curRowIndex}:P${curRowIndex}`,
      value: data.warehouseCode,
      font: FONT_BOLD_8,
      aligment: ALIGNMENT_LEFT,
      translate: false,
      border: BORDER,
      merge: true,
    });
    curRowIndex++;

    data.items.forEach((row2, index) => {
      totalAccodingBookG += row2.totalPlanQuantity;
      totalAccodingInventoryG += row2.totalActualQuantity;
      cells.push(
        ...[
          {
            nameCell: `A${curRowIndex}`,
            value: index + 1,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
          },
          {
            nameCell: `B${curRowIndex}`,
            value: row2.itemCode,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_LEFT,
            translate: false,
            border: BORDER,
          },
          {
            nameCell: `C${curRowIndex}`,
            value: row2.itemName,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_LEFT,
            translate: false,
            border: BORDER,
          },
          {
            nameCell: `D${curRowIndex}`,
            value: row2.unit,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_LEFT,
            translate: false,
            border: BORDER,
          },
          {
            nameCell: `E${curRowIndex}`,
            value: row2.lotNumber,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_CENTER,
            translate: false,
            border: BORDER,
          },
          {
            nameCell: `F${curRowIndex}`,
            value: row2.totalPlanQuantity,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `G${curRowIndex}`,
            value: row2.storageCost,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `H${curRowIndex}`,
            value: row2.totalPricePlan,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `I${curRowIndex}`,
            value: row2.totalActualQuantity,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `J${curRowIndex}`,
            value: row2.storageCost,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `K${curRowIndex}`,
            value: row2.totalPriceActual,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `L${curRowIndex}`,
            value: row2.totalPlanQuantity - row2.totalActualQuantity,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `M${curRowIndex}`,
            value: row2.totalPricePlan - row2.totalPriceActual,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `N${curRowIndex}`,
            value: row2.totalActualQuantity - row2.totalPlanQuantity,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `O${curRowIndex}`,
            value: row2.totalPriceActual - row2.totalPricePlan,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_RIGHT,
            translate: false,
            border: BORDER,
            numFmt: '### ### ### ###',
          },
          {
            nameCell: `P${curRowIndex}`,
            value: row2.note,
            font: FONT_NORMAL_9,
            aligment: ALIGNMENT_LEFT,
            translate: false,
            border: BORDER,
          },
        ],
      );
      curRowIndex++;
    });

    //total
    cells.push(
      ...[
        {
          nameCell: `A${curRowIndex}:P${curRowIndex}`,
          border: BORDER,
        },
        {
          nameCell: `A${curRowIndex}:E${curRowIndex}`,
          value: 'TOTAL_PRICE_WAREHOUSE',
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_LEFT,
          translate: true,
          border: BORDER,
          merge: true,
        },
        {
          nameCell: `F${curRowIndex}`,
          value: data.totalPlanQuantity,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          translate: false,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `I${curRowIndex}`,
          value: data.totalActualQuantity,
          font: FONT_BOLD_8,
          aligment: ALIGNMENT_RIGHT,
          translate: false,
          border: BORDER,
          numFmt: '### ### ### ###',
        },
        {
          nameCell: `L${curRowIndex}:P${curRowIndex}`,
          border: BORDER,
          merge: true,
        },
      ],
    );
    curRowIndex++;
  });

  cells.push(
    ...[
      {
        nameCell: `A${curRowIndex}:P${curRowIndex}`,
        border: BORDER,
      },
      {
        nameCell: `G${curRowIndex}:H${curRowIndex}`,
        border: BORDER,
        merge: true,
      },
      {
        nameCell: `J${curRowIndex}:K${curRowIndex}`,
        border: BORDER,
        merge: true,
      },
      {
        nameCell: `A${curRowIndex}:E${curRowIndex}`,
        value: 'TOTAL_PRICE_WAREHOUSE',
        font: FONT_BOLD_10,
        aligment: ALIGNMENT_LEFT,
        translate: true,
        border: BORDER,
        merge: true,
      },
      {
        nameCell: `F${curRowIndex}`,
        value: totalAccodingBookG,
        font: FONT_BOLD_10,
        aligment: ALIGNMENT_RIGHT,
        translate: false,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `I${curRowIndex}`,
        value: totalAccodingInventoryG,
        font: FONT_BOLD_10,
        aligment: ALIGNMENT_RIGHT,
        translate: false,
        border: BORDER,
        numFmt: '### ### ### ###',
      },
      {
        nameCell: `L${curRowIndex}:P${curRowIndex}`,
        border: BORDER,
        merge: true,
      },
    ],
  );

  curRowIndex++;
  configCells(worksheet, i18n, cells);
  curRowIndex++;

  return curRowIndex;
}
