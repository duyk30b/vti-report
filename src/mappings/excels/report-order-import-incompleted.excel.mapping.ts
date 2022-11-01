import { ReportType } from '@enums/report-type.enum';
import { footerOrderImportIncompleted } from '@layout/excel/footer/footer-order-import-incompleted';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_IMPORT_INCOMPLETE_COLUMN } from '@layout/excel/table-column-excel/report-import-incomplete-column ';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { OrderImportIncompleteModel } from '@models/order-import-incomplete.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderImportIncompletedExcelMapping(
  request: ReportRequest,
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
) {
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;

    if (!prev[warehouseCode]) {
      prev[warehouseCode] = [];
    }
    const data: OrderImportIncompleteModel = {
      index: 0,
      orderCode: cur.orderCode,
      orderCreatedAt: cur.orderCreatedAt,
      departmentReceiptName: cur.departmentReceiptName,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      quantity: cur.planQuantity,
      unitPrice: cur.storageCost,
      totalPrice: cur.storageCost * cur.planQuantity,
      construction: cur.constructionName,
      deliver: cur.performerName,
    };
    prev[warehouseCode].push(data);
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
    departmentReceiptName: Alignment.LEFT,
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
    childCompany: data[0]?.companyName,
    addressChildCompany: data[0]?.companyAddress,
    tableColumn: REPORT_IMPORT_INCOMPLETE_COLUMN,
    tableData: dataExcell,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_IMPORT_INCOMPLETED]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseId ? data[0].warehouseName : null,
    footer: footerOrderImportIncompleted,
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
