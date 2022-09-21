import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_IMPORT_INCOMPLETE_COLUMN } from '@layout/excel/table-column-excel/report-import-incomplete-column ';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/reportGroupByWarehouse.template-data';
import { OrderImportIncompleteModel } from '@models/order-import-incomplete.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { REPORT_INFO } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderImportIncompletedExcelMapping(
  request: ReportRequest,
  data: ReportOrderItemLot[],
  i18n: I18nRequestScopeService,
) {
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;

    if (!prev[warehouseCode]) {
      prev[cur.warehouseCode] = [];
    }
    const data: OrderImportIncompleteModel = {
      index: 0,
      orderCode: cur.orderCode,
      orderCreatedAt: cur.orderCreatedAt,
      receiveDepartmentName: cur.receiveDepartmentName,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      quantity: cur.planQuantity,
      unitPrice: cur.cost,
      totalPrice: cur.cost * cur.planQuantity,
      construction: cur.constructionName,
      deliver: cur.performerName,
    };
    prev[cur.warehouseCode].push(data);
    return prev;
  }, {});
  const dataExcell: TableData<OrderImportIncompleteModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  const formatByKey: FormatByKey<OrderImportIncompleteModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    orderCreatedAt: Alignment.LEFT,
    receiveDepartmentName: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    quantity: Alignment.LEFT,
    construction: Alignment.LEFT,
    unitPrice: Alignment.LEFT,
    totalPrice: Alignment.LEFT,
    deliver: Alignment.LEFT,
  };

  const model: ReportModel<OrderImportIncompleteModel> = {
    parentCompany: i18n.translate('report.PARENT_COMPANY'),
    childCompany: data[0]?.companyName,
    addressChildCompany: data[0]?.companyAddress,
    tableColumn: REPORT_IMPORT_INCOMPLETE_COLUMN,
    tableData: dataExcell,
    header: true,
    columnLevel: 1,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_IMPORT_INCOMPLETED]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseId ? data[0].warehouseName : null,
  };
  const { dataBase64, nameFile } = await generateTable(
    model,
    reportGroupByWarehouseTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
