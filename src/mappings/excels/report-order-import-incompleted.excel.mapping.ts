import { ReportType } from '@enums/report-type.enum';
import { footerReportOrderImportIncompleted } from '@layout/excel/footer/footer-report-order-import-incompleted';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_IMPORT_INCOMPLETE_COLUMN } from '@layout/excel/table-column-excel/report-import-incomplete-column ';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
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
  data: ReportInfo<TableData<OrderImportIncompleteModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<OrderImportIncompleteModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    orderCreatedAt: Alignment.LEFT,
    departmentReceiptName: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    actualQuantity: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    constructionName: Alignment.LEFT,
    storageCost: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    totalPrice: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    deliverName: Alignment.LEFT,
  };

  const model: ReportModel<OrderImportIncompleteModel> = {
    companyCode: data.companyCode,
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: REPORT_IMPORT_INCOMPLETE_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_IMPORT_INCOMPLETED]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    reportType: request?.reportType || 0,
    footer: footerReportOrderImportIncompleted,
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
