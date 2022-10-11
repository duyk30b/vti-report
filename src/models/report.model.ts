export interface TableColumn {
  name: string;
  width?: number;
  child?: {
    name: string;
    width?: number;
    child?: {
      name: string;
      width: number;
    }[];
  }[];
}

export interface TableData<T> {
  warehouseCode: string;
  data: T[];
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
  [P in keyof T]?: Alignment;
};

export interface ReportModel<T> {
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
}
