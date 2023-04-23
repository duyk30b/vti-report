import { ReportType } from '@enums/report-type.enum';
import { footerOrderTransferIncompleted } from '@layout/excel/footer/footer-order-transfer-incompleted';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ORDER_TRANSFER_INCOMPLETE_COLUMN } from '@layout/excel/table-column-excel/report-order-transfer-incomplete-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { OrderTransferIncompleteModel } from '@models/order-transfer incomplete.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderTransferIncompletedExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<OrderTransferIncompleteModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<OrderTransferIncompleteModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    planQuantity: Alignment.RIGHT,
    constructionName: Alignment.LEFT,
    warehouseImport: Alignment.LEFT,
  };

  const model: ReportModel<OrderTransferIncompleteModel> = {
    companyCode: data?.companyCode,
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: REPORT_ORDER_TRANSFER_INCOMPLETE_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_TRANSFER_INCOMPLETED]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    reportType: request?.reportType || 0,
    footer: footerOrderTransferIncompleted,
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
