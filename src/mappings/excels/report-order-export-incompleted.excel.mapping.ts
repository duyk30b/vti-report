import { ReportType } from '@enums/report-type.enum';
import { footerOrderTransferIncompleted } from '@layout/excel/footer/footer-order-transfer-incompleted';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ORDER_EXPORT_INCOMPLETE_COLUMN } from '@layout/excel/table-column-excel/report-order-exported-incomplete-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { OrderExportIncompleteModel } from '@models/order-exported-incomplete.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderExportIncompletedExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<OrderExportIncompleteModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<OrderExportIncompleteModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    actualQuantity: Alignment.RIGHT,
    constructionName: Alignment.LEFT,
    receiver: Alignment.LEFT,
  };

  const model: ReportModel<OrderExportIncompleteModel> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: REPORT_ORDER_EXPORT_INCOMPLETE_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_EXPORT_INCOMPLETED]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
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
