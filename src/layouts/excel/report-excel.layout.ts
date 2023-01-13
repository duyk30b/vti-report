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
  FONT_BOLD_11,
  FONT_BOLD_14,
  FONT_BOLD_9,
  FONT_NORMAL_9,
  HEIGHT_REPORT_TITLE,
  INDEX_REPORT_TIME,
  INDEX_REPORT_TITLE,
  LV1,
  LV3,
  REPORT_INFO,
  ROW_WHEN_HAVE_HEADER,
  ROW_WHEN_NOT_HAVE_HEADER,
} from '@utils/constant';
import { ARR_REPORT_TYPE_CHANGE_FONT_SIZE, ReportType } from '@enums/report-type.enum';
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

  let fontSize = FONT_BOLD_11;
  const reportType = model.tableData[0]?.reportType || 0;
  if (ARR_REPORT_TYPE_CHANGE_FONT_SIZE.includes(reportType)) fontSize = FONT_BOLD_10;

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

  const index = getChildNestedOfArray(model.tableColumn, 'child', worksheet);
  worksheet['columnNumber_'] = index;
  //header
  if (model.header) {
    worksheet.mergeCells(
      `${CELL_TITLE_REPORT}:${EXCEL_COLUMN[index - 2]}${INDEX_REPORT_TITLE}`,
    );
    worksheet.mergeCells(
      `${CEll_REPORT_TIME}:${EXCEL_COLUMN[index - 2]}${INDEX_REPORT_TIME}`,
    );
    worksheet.getRow(INDEX_REPORT_TITLE).height = HEIGHT_REPORT_TITLE;

    configCells(worksheet, i18n, [
      {
        nameCell: CELL_PARENT_COMPANY,
        value: 'PARENT_COMPANY',
        font: FONT_BOLD_10,
        aligment: ALIGNMENT_LEFT,
        translate: true,
        merge: false,
        heightRow: {
          index: 1,
          value: 30,
        },
      },
      {
        nameCell: CELL_CHILD_COMPANY,
        value: model.childCompany,
        font: FONT_BOLD_10,
        aligment: ALIGNMENT_LEFT,
        translate: false,
        merge: false,
      },

      {
        nameCell: CELL_ADDRESS_CHILD_COMPANY,
        value: model.addressChildCompany,
        font: FONT_BOLD_10,
        aligment: ALIGNMENT_LEFT,
        translate: false,
        merge: false,
        heightRow: {
          index: 3,
          value: 35,
        },
      },
      {
        nameCell: CELL_TITLE_REPORT,
        value: title,
        font: FONT_BOLD_14,
        aligment: ALIGNMENT_CENTER,
        translate: false,
      },
      {
        nameCell: CEll_REPORT_TIME,
        value: reportTime,
        font: fontSize,
        aligment: ALIGNMENT_CENTER,
        translate: false,
      },
    ]);

    if (
      [
        REPORT_INFO[ReportType[ReportType.SITUATION_IMPORT_PERIOD]].key,
        REPORT_INFO[ReportType[ReportType.SITUATION_EXPORT_PERIOD]].key,
        REPORT_INFO[ReportType[ReportType.SITUATION_TRANSFER]].key,
      ].includes(model.key)
    ) {
      configCells(worksheet, i18n, [
        {
          nameCell: CELL_REPORT_NUMBER,
          value: 'REPORT_NUMBER',
          font: FONT_NORMAL_9,
          aligment: ALIGNMENT_LEFT,
          translate: true,
          merge: false,
        },
      ]);
    }
    
  }
  let rowIndex = model.header ? ROW_WHEN_HAVE_HEADER : ROW_WHEN_NOT_HAVE_HEADER;
  rowIndex += generateColumnTable(worksheet, model.tableColumn, rowIndex, i18n);
  if (typeof generateDataTable == 'function') {
    rowIndex = generateDataTable(
      rowIndex,
      worksheet,
      model.tableData,
      model?.aligmentCell,
      i18n,
    );
  }
  if (typeof model.footer == 'function') {
    model.footer(rowIndex, worksheet, i18n, model?.companyCode);
  }
  worksheet.columns[0].width = 30;  
  const buffer = await workbook.xlsx.writeBuffer();
  // workbook.xlsx.writeFile(`demo${Math.floor(Math.random() * 1000)}.xlsx`);

  return {
    dataBase64: buffer,
    nameFile,
  };
};

const generateColumnTable = (
  worksheet: ExcelJS.Worksheet,
  tableColumn: TableColumn[],
  rowIdx: number,
  i18n: I18nRequestScopeService,
) => {
  const checkLevel = tableColumn.some((column) => column['child']);
  const columnsByLevel = tableColumn.map((item, index) => {
    const lv = {
      lv1: [],
      lv2: [],
      lv3: [],
    };
    genLevelColumn([item], 'child', lv);
    return lv;
  });

  let curColumn = 0;
  const cells: ConfigCells[] = [];
  for (const column of columnsByLevel) {
    if (column.lv3.length) {
      const cellLv1 = `${EXCEL_COLUMN[curColumn] + rowIdx}:${
        EXCEL_COLUMN[curColumn + column.lv3.length - 1] + rowIdx
      }`;
      let index = curColumn;
      cells.push(
        {
          nameCell: cellLv1,
          value: column.lv1[0].name,
          font: FONT_BOLD_9,
          aligment: ALIGNMENT_CENTER_BOTTOM,
          border: BORDER,
          fill: COLUMN_COLOR,
          translate: true,
          merge: true,
        },
        ...column.lv2.map((lv2) => {
          const cellLv2 = `${EXCEL_COLUMN[index] + (rowIdx + 1)}:${
            EXCEL_COLUMN[index + lv2.child.length - 1] + (rowIdx + 1)
          }`;
          index += lv2.child.length;
          return {
            nameCell: cellLv2,
            value: lv2.name,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_CENTER_BOTTOM,
            border: BORDER,
            fill: COLUMN_COLOR,
            translate: true,
            merge: true,
          };
        }),
        ...column.lv3.map((lv2, index) => {
          const cellLv2 = `${EXCEL_COLUMN[curColumn + index] + (rowIdx + 2)}`;
          return {
            nameCell: cellLv2,
            value: lv2.name,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_CENTER_BOTTOM,
            border: BORDER,
            fill: COLUMN_COLOR,
            translate: true,
          };
        }),
      );
      curColumn += column.lv3.length;
      continue;
    }
    if (column.lv2.length) {
      const cellLv1 = `${EXCEL_COLUMN[curColumn] + rowIdx}:${
        EXCEL_COLUMN[curColumn + column.lv2.length - 1] + (rowIdx + 1)
      }`;
      cells.push(
        {
          nameCell: cellLv1,
          value: column.lv1[0].name,
          font: FONT_BOLD_9,
          aligment: ALIGNMENT_CENTER_BOTTOM,
          border: BORDER,
          fill: COLUMN_COLOR,
          merge: true,
          translate: true,
        },
        ...column.lv2.map((lv2, index) => {
          const cellLv2 = `${EXCEL_COLUMN[curColumn + index] + (rowIdx + 2)}`;
          return {
            nameCell: cellLv2,
            value: lv2.name,
            font: FONT_BOLD_9,
            aligment: ALIGNMENT_CENTER_BOTTOM,
            border: BORDER,
            fill: COLUMN_COLOR,
            translate: true,
          };
        }),
      );
      curColumn += column.lv2.length;
      continue;
    }
    if (column.lv1.length) {
      let cellLv1;
      if (checkLevel) {
        cellLv1 = `${EXCEL_COLUMN[curColumn] + rowIdx}:${
          EXCEL_COLUMN[curColumn] + (rowIdx + 2)
        }`;
      } else {
        const heightOfRow = HEIGHT_REPORT_TITLE;
        cellLv1 = `${EXCEL_COLUMN[curColumn] + rowIdx}`;
        worksheet.getRow(rowIdx).height = heightOfRow;
      }
      cells.push({
        nameCell: cellLv1,
        value: column?.lv1[0]?.name,
        font: FONT_BOLD_9,
        aligment: ALIGNMENT_CENTER_BOTTOM,
        border: BORDER,
        fill: COLUMN_COLOR,
        merge: true,
        translate: true,
      });
      curColumn++;
    }
  }
  configCells(worksheet, i18n, cells);
  return checkLevel ? LV3 : LV1;
};

export const getReportInfo = (
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
    const dateForFile = moment(dateFrom).format(DATE_FOMAT_EXCELL_FILE);
    const date = moment(dateFrom).format(DATE_FOMAT_EXCELL);
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

export interface ConfigCells {
  nameCell: string;
  value?: any;
  font?: any;
  aligment?: any;
  translate?: boolean;
  border?: any;
  fill?: any;
  merge?: boolean;
  numFmt?: string;
  heightRow?: { value: number; index: number };
}
export function configCells(
  worksheet: ExcelJS.Worksheet,
  i18n: I18nRequestScopeService,
  cells: ConfigCells[],
) {
  cells.forEach((cell) => {
    const curCell = worksheet.getCell(cell.nameCell);
    if (cell.heightRow) {
      worksheet.getRow(cell.heightRow.index).height = cell.heightRow.value;
    }
    if (cell?.merge) worksheet.mergeCells(cell.nameCell);
    if (typeof cell.value !== 'undefined') {
      if (cell.translate) {
        curCell.value = i18n.translate(`report.${cell.value}`);
      } else {
        curCell.value = cell.value;
      }
    }
    if (cell?.border) curCell.border = cell.border;
    if (cell?.fill) curCell.fill = cell.fill;
    if (cell?.numFmt) curCell.numFmt = cell.numFmt;

    if (cell.font) curCell.font = cell.font;
    if (cell.aligment) curCell.alignment = cell.aligment;
  });
}

function genLevelColumn(
  ob: Array<any>,
  key: string,
  levelColumn: {
    lv1: any[];
    lv2: any[];
    lv3: any[];
  },
  position = 1,
) {
  for (const child of ob) {
    if (child[key]) {
      position = genLevelColumn(child[key], key, levelColumn, position + 1);
      genLevelColumnSwitch(child, position, levelColumn);
    } else {
      genLevelColumnSwitch(child, position, levelColumn);
    }
  }
  return position - 1;
}

function genLevelColumnSwitch(child, ps, levelColumn) {
  switch (ps) {
    case 1:
      levelColumn.lv1.push(child);
      break;
    case 2:
      levelColumn.lv2.push(child);
      break;
    case 3:
      levelColumn.lv3.push(child);
      break;
  }
}

function getChildNestedOfArray(
  arr: Array<any>,
  key: string,
  worksheet: ExcelJS.Worksheet,
  result = 1,
) {
  for (const item of arr) {
    if (item[key]) {
      result = getChildNestedOfArray(item[key], key, worksheet, result);
    } else {
      worksheet.getColumn(result).width = item.width;
      result++;
    }
  }

  return result;
}
