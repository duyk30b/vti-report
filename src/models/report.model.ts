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

export interface TableDataSituationTransfer {
  warehouseCode: string;
  postCode: [
    {
      postCode: string;
      reportDate: string;
      importWarehouse: string;
      explain: string;
      item: Array<{
        itemCode: string;
        itemName: string;
        lot: string;
        accountDebt: string;
        accountDebtNumber: number;
        unit: string;
        quantity: number;
        positionName: string;
        unitPrice: number;
        totalPrice: number;
      }>;
    },
  ];
}

export interface TableDataSituationInventoryPeriod {
  warehouseCode: string;
  item: Array<{
    itemCode: string;
    itemName: string;
    unit: string;
    lot: string;
    accordingBookQuantity: number;
    accordingBookUnitPrice: number;
    accordingBookTotalPrice: number;
    accordingInventoryQuantity: number;
    accordingInventoryUnitPrice: number;
    accordingInventoryTotalPrice: number;
    differenceExcessQuantity: number;
    differenceExcessTotal: number;
    differenceLackQuantity: number;
    differenceLackTotal: number;
    note: string;
  }>;
}

export interface TableDataSituationImportPeriod {
  warehouseCode: string;
  purpose: string;
  post: {
    postCode: string;
    orderCreatedAt: string;
    contract: string;
    contruction: string;
    provider: string;
    unitReciver: string;
    explain: string;
    cost: number;
    item: Array<{
      itemCode: string;
      itemName: string;
      lot: string;
      AccountDebtQuantity: string;
      AccountDebtTotal: string;
      unit: string;
      quantity: string;
      position: string;
      unitPrice: string;
      cost: number;
      totalPrice: number;
    }>;
  }[];
}

export interface TableDataSituationExportPeriod {
  warehouseCode: string;
  purposes: {
    value: string;
    orders: {
      orderCode: string;
      orderCreatedDate: string;
      contruction: string;
      receiveDepartmentName: string;
      explain: string;
      items: Array<{
        itemCode: string;
        itemName: string;
        lot: string;
        AccountDebtQuantity: string;
        AccountDebtTotal: string;
        unit: string;
        planQuantity: string;
        exportedQuantity: string;
        positionExport: string;
        unitPrice: number;
        totalPrice: number;
      }>;
    }[];
  }[];
}

export interface TableAgeOfItemStock {
  row1: {
    warehouseCode: string;
    total: string;
    sixMonth: string;
    sixMonthToOneYear: string;
    oneToTowYear: string;
    towToThreeYear: string;
    threeToFourYear: string;
    fourToFiveYear: string;
    GreaterFiveYear: string;
  };
  row2: {
    itemCode: string;
    itemName: string;
    quantity: string;
    totalQuantity: string;
    sixMonth: string;
    sixMonthToOneYear: string;
    oneToTowYear: string;
    towToThreeYear: string;
    threeToFourYear: string;
    fourToFiveYear: string;
    GreaterFiveYear: string;
  };
  row3: Array<{
    dateImport: string;
    sourceItem: string;
    account: string;
    lot: string;
    position: string;
    unit: string;
    quantity: string;
    unitPrice: string;
    totalQuantity: string;
    sixMonth: string;
    sixMonthToOneYear: string;
    oneToTowYear: string;
    towToThreeYear: string;
    threeToFourYear: string;
    fourToFiveYear: string;
    greaterFiveYear: string;
  }>;
}

export interface ReportModel<T> {
  parentCompany: string;
  childCompany: string;
  addressChildCompany: string;
  tableColumn: TableColumn[];
  tableData: TableData<T>[] | T;
  header: boolean;
  columnLevel: 1 | 3;
  aligmentCell?: FormatByKey<any>;
  key: string;
  warehouse?: string;
  dateFrom: Date;
  dateTo?: Date;
}
