import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ORDER_EXPORT_BY_REQUEST_FOR_ITEM_MODEL } from '@layout/excel/table-column-excel/report-order-export-by-request-for-item-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportOrderExportByRequestForItemModel } from '@models/order-export-by-request-for-item.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderExportByRequestForItem(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportOrderExportByRequestForItemModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<ReportOrderExportByRequestForItemModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    warehouseExportProposals: Alignment.LEFT,
    orderCode: Alignment.LEFT,
    orderCreatedAt: Alignment.CENTER,
    planQuantity: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    exportedQuantity: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    status: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
  };

  const model: ReportModel<ReportOrderExportByRequestForItemModel> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: REPORT_ORDER_EXPORT_BY_REQUEST_FOR_ITEM_MODEL,
    tableData: data.dataMapped,
    header: false,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_EXPORT_BY_REQUEST_FOR_ITEM]]
      .key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    reportType: request?.reportType || 0,
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
