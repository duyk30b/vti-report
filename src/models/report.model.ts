import * as ExcelJS from 'exceljs';
import { I18nRequestScopeService } from 'nestjs-i18n/dist/services/i18n-request-scope.service';
export interface TableColumn {
  name: string;
  width?: number;
  child?: TableColumn[];
  rowSpan?: number;
  columnSpan?: number;
}

export interface TableData<T> {
  warehouseCode: string;
  data: T[];
  reportType?: number;
}

export enum Alignment {
  CENTER,
  LEFT,
  RIGHT,
  BOTTOM,
  CENTER_LEFT,
  CENTER_RIGHT,
}

export type FormatByKey<T> = {
  [P in keyof T]?: Alignment | { alignment: Alignment; numFmt: string };
};

export interface ReportModel<T> {
  companyCode?: string;
  childCompany: string;
  addressChildCompany: string;
  tableColumn: TableColumn[];
  tableData: TableData<T>[] | T;
  header: boolean;
  aligmentCell?: FormatByKey<any>;
  key: string;
  warehouse?: string;
  dateFrom: Date;
  dateTo?: Date;
  reportType?: number;
  footer?: (
    curRowIdx: number,
    worksheet: ExcelJS.Worksheet,
    i18n: I18nRequestScopeService,
    companyCode: string,
  ) => void;
}
