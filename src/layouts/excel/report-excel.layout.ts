import {
  FormatByKey,
  ReportModel,
  TableColumn,
  TableData,
} from '@models/report.model';
import * as ExcelJS from 'exceljs';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';
import {
  ALIGNMENT_CENTER,
  ALIGNMENT_CENTER_BOTTOM,
  ALIGNMENT_LEFT,
  BORDER,
  CELL_ADDRESS_CHILD_COMPANY,
  CELL_CHILD_COMPANY,
  CELL_PARENT_COMPANY,
  CELL_REPORT_NUMBER,
  CEll_REPORT_TIME,
  CELL_TITLE_REPORT,
  COLUMN_COLOR,
  DATE_FOMAT_EXCELL,
  DATE_FOMAT_EXCELL_FILE,
  EXCEL_COLUMN,
  FONT_BOLD_10,
  FONT_BOLD_14,
  FONT_BOLD_9,
  FONT_NORMAL_10,
  HEIGHT_REPORT_TITLE,
  INDEX_REPORT_TIME,
  INDEX_REPORT_TITLE,
  KEY_COLUMN,
  ROW_WHEN_HAVE_HEADER,
  ROW_WHEN_NOT_HAVE_HEADER,
} from '@utils/constant';
export const generateTable = async (
  model: ReportModel<any>,
  generateDataTable: (
    currenRowIndex: number,
    worksheet: ExcelJS.Worksheet,
    tableData?: TableData<any>[] | any,
    cellAligment?: FormatByKey<any>,
    i18n?: I18nRequestScopeService,
  ) => number,
  i18n: I18nRequestScopeService,
) => {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    model.key,
    model.warehouse,
    model.dateFrom,
    model.dateTo,
  );
  // const path = process.cwd() + '//';
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: false }],
    pageSetup: {
      orientation: 'portrait',
      fitToPage: true,
      margins: {
        left: 0.25,
        right: 0.25,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
    },
    properties: { tabColor: { argb: '6B5B95' }, defaultRowHeight: 18.75 },
  });

  const index = getColumnIndex(model.tableColumn, KEY_COLUMN, worksheet);
  //header
  if (model.header) {
    if (model.columnLevel !== 1) {
      worksheet.mergeCells(
        `${CELL_TITLE_REPORT}:${EXCEL_COLUMN[index - 1]}${INDEX_REPORT_TITLE}`,
      );
      worksheet.mergeCells(
        `${CEll_REPORT_TIME}:${EXCEL_COLUMN[index - 1]}${INDEX_REPORT_TIME}`,
      );
    } else {
      const lengthColumn = model.tableColumn.length;

      worksheet.mergeCells(
        `${CELL_TITLE_REPORT}:${
          EXCEL_COLUMN[lengthColumn - 1]
        }${INDEX_REPORT_TITLE}`,
      );
      worksheet.mergeCells(
        `${CEll_REPORT_TIME}:${
          EXCEL_COLUMN[lengthColumn - 1]
        }${INDEX_REPORT_TIME}`,
      );
    }

    worksheet.getRow(INDEX_REPORT_TITLE).height = HEIGHT_REPORT_TITLE;

    const cellParentCompany = worksheet.getCell(CELL_PARENT_COMPANY);
    const cellChildCompany = worksheet.getCell(CELL_CHILD_COMPANY);
    const cellAddressChildCompany = worksheet.getCell(
      CELL_ADDRESS_CHILD_COMPANY,
    );
    const cellReportNumber = worksheet.getCell(CELL_REPORT_NUMBER);
    const cellTitle = worksheet.getCell(CELL_TITLE_REPORT);
    const cellReportTime = worksheet.getCell(CEll_REPORT_TIME);

    cellParentCompany.value = model.parentCompany;
    cellChildCompany.value = model.childCompany;
    cellAddressChildCompany.value = model.addressChildCompany;
    cellReportNumber.value = i18n.translate('report.REPORT_NUMBER');
    cellTitle.value = title;
    cellReportTime.value = reportTime;

    cellParentCompany.font = FONT_BOLD_10;
    cellChildCompany.font = FONT_BOLD_10;
    cellAddressChildCompany.font = FONT_BOLD_10;
    cellReportNumber.font = FONT_NORMAL_10;
    cellTitle.font = FONT_BOLD_14;
    cellReportTime.font = FONT_BOLD_10;

    cellParentCompany.alignment = ALIGNMENT_LEFT as any;
    cellChildCompany.alignment = ALIGNMENT_LEFT as any;
    cellAddressChildCompany.alignment = ALIGNMENT_LEFT as any;
    cellReportNumber.alignment = ALIGNMENT_LEFT as any;
    cellTitle.alignment = ALIGNMENT_CENTER as any;
    cellReportTime.alignment = ALIGNMENT_CENTER as any;
  }
  let rowIndex = model.header ? ROW_WHEN_HAVE_HEADER : ROW_WHEN_NOT_HAVE_HEADER;

  generateColumnTable(
    worksheet,
    model.tableColumn,
    rowIndex,
    model.columnLevel,
    i18n,
  );

  rowIndex += model.columnLevel;
  if (typeof generateDataTable == 'function') {
    generateDataTable(
      rowIndex,
      worksheet,
      model.tableData,
      model?.aligmentCell,
      i18n,
    );
  }

  // await workbook.xlsx.writeFile(path + `${nameFile || 'default_name'}.xlsx`);
  const buffer = await workbook.xlsx.writeBuffer();
  const str = (buffer as Buffer).toString('base64');
  return {
    dataBase64: str,
    nameFile,
  };
};

const generateColumnTable = (
  worksheet: ExcelJS.Worksheet,
  tableColumn: TableColumn[],
  rowIndex: number,
  columnLevel: number,
  i18n: I18nRequestScopeService,
) => {
  if (columnLevel === 1) {
    const heightOfRow = 36;
    worksheet.getRow(rowIndex).height = heightOfRow;
    for (const [index, column] of tableColumn.entries()) {
      configColumn(
        worksheet,
        i18n,
        `${EXCEL_COLUMN[index] + rowIndex}`,
        column.name,
        BORDER,
        FONT_BOLD_9,
        ALIGNMENT_CENTER_BOTTOM,
        false,
        COLUMN_COLOR,
      );
    }
  } else {
    let columnIndex = 0;
    for (const lv1 of tableColumn) {
      //gen column lv 3
      if (lv1.child[0]?.child) {
        let numberChild = getNumberChill(lv1, 'child');

        //MERGER LV1
        const cellTobeMerge = `${EXCEL_COLUMN[columnIndex] + rowIndex}:${
          EXCEL_COLUMN[columnIndex + numberChild - 1] + rowIndex
        }`;
        configColumn(
          worksheet,
          i18n,
          cellTobeMerge,
          lv1.name,
          BORDER,
          FONT_BOLD_9,
          ALIGNMENT_CENTER_BOTTOM,
          true,
          COLUMN_COLOR,
        );

        //MERGER LV2
        for (const lv2 of lv1.child) {
          const cellTobeMerge = `${
            EXCEL_COLUMN[columnIndex] + (rowIndex + 1)
          }:${
            EXCEL_COLUMN[columnIndex + (lv2.child.length - 1)] + (rowIndex + 1)
          }`;

          configColumn(
            worksheet,
            i18n,
            cellTobeMerge,
            lv2.name,
            BORDER,
            FONT_BOLD_9,
            ALIGNMENT_CENTER_BOTTOM,
            true,
            COLUMN_COLOR,
          );
        }
        //MERGER LV3
        let currentColumnIndex_lv3 = columnIndex;
        for (const lv2 of lv1.child) {
          for (const lv3 of lv2.child) {
            const cell_lv3 = `${
              EXCEL_COLUMN[currentColumnIndex_lv3] + (rowIndex + 2)
            }`;
            configColumn(
              worksheet,
              i18n,
              cell_lv3,
              lv3.name,
              BORDER,
              FONT_BOLD_9,
              ALIGNMENT_CENTER_BOTTOM,
              true,
              COLUMN_COLOR,
            );
            currentColumnIndex_lv3++;
          }
        }

        columnIndex += numberChild;
      } else {
        //gen column lv 2
        const cellTobeMerge = `${EXCEL_COLUMN[columnIndex] + rowIndex}:${
          EXCEL_COLUMN[columnIndex + lv1.child.length - 1] + (rowIndex + 1)
        }`;

        configColumn(
          worksheet,
          i18n,
          cellTobeMerge,
          lv1.name,
          BORDER,
          FONT_BOLD_9,
          ALIGNMENT_CENTER_BOTTOM,
          true,
          COLUMN_COLOR,
        );
        for (const [index, lv2] of lv1.child.entries()) {
          const cellLv2 = EXCEL_COLUMN[columnIndex + index] + (rowIndex + 2);
          configColumn(
            worksheet,
            i18n,
            cellLv2,
            lv2.name,
            BORDER,
            FONT_BOLD_9,
            ALIGNMENT_CENTER_BOTTOM,
            true,
            COLUMN_COLOR,
          );
        }
        columnIndex += lv1.child.length;
      }
    }
  }
};

const getReportInfo = (
  i18n: I18nRequestScopeService,
  key: string,
  warehouse: string,
  dateFrom: Date,
  dateTo?: Date,
) => {
  let nameFile = '';
  let title = '';
  let sheetName = '';
  let reportTime = '';
  if (dateTo && dateFrom) {
    const dateFromFormatedForFile = moment(dateFrom).format(
      DATE_FOMAT_EXCELL_FILE,
    );
    const dateToFormatedForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    const dateFromFormated = moment(dateFrom).format(DATE_FOMAT_EXCELL);
    const dateToFormated = moment(dateTo).format(DATE_FOMAT_EXCELL);
    nameFile = i18n.translate(`report.${key}.SHEET_NAME`, {
      args: { property: dateFromFormatedForFile + '_' + dateToFormatedForFile },
    });
    sheetName = i18n.translate(`report.${key}.SHEET_NAME`, {
      args: { property: dateFromFormatedForFile + '_' + dateToFormatedForFile },
    });

    reportTime = i18n.translate(`report.DATE_TEMPLATE_TO_FROM`, {
      args: {
        from: dateFromFormated,
        to: dateToFormated,
      },
    });
  } else {
    const dateForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    const date = moment(dateTo).format(DATE_FOMAT_EXCELL);
    nameFile = i18n.translate(`report.${key}.SHEET_NAME`, {
      args: { property: dateForFile },
    });
    sheetName = i18n.translate(`report.${key}.SHEET_NAME`, {
      args: { property: dateForFile },
    });

    reportTime = i18n.translate(`report.DATE_TEMPLATE_TO`, {
      args: {
        to: date,
      },
    });
  }

  let property = '';
  if (warehouse) {
    property = warehouse.toUpperCase();
  } else {
    property = i18n.translate(`report.REPORT_ALL`);
  }
  title = i18n.translate(`report.${key}.TITLE`, {
    args: { property: property },
  });

  return {
    nameFile,
    title,
    sheetName,
    reportTime,
  };
};

function getColumnIndex(
  arr: Array<TableColumn>,
  key: string,
  worksheet: ExcelJS.Worksheet,
  index = 1,
): number {
  if (arr.length == 0) {
    return;
  }
  for (const column of arr) {
    if (column[key]) {
      getColumnIndex(column[key], key, worksheet, index + 1);
    } else {
      worksheet.getColumn(index).width = column.width;
      index++;
    }
  }
  return index;
}

function configColumn(
  worksheet: ExcelJS.Worksheet,
  i18n: I18nRequestScopeService,
  cell: string,
  value: string,
  border: any,
  font: any,
  aligment: any,
  merge: boolean,
  fill?: any,
) {
  const curCell = worksheet.getCell(cell);
  if (merge) worksheet.mergeCells(cell);
  if (fill) curCell.fill = fill;
  curCell.value = i18n.translate(`report.${value}`);
  curCell.border = border;
  curCell.font = font;
  curCell.alignment = aligment;
}

function getNumberChill(ob, key, index = { number: 0 }) {
  for (const item of ob[key]) {
    if (item[key]) {
      index.number += 1;
      getNumberChill(item, key, index);
    } else {
      index.number += 1;
    }
  }
  return index.number;
}
