import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ORDER_IMPORT_BY_REQUEST_FOR_ITEM_MODEL } from '@layout/excel/table-column-excel/report-order-import-by-request-for-item-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportOrderImportByRequestForItemModel } from '@models/order-import-by-request-for-item.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { minus } from '@utils/common';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderImportByRequestForItemExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportOrderImportByRequestForItemModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<ReportOrderImportByRequestForItemModel> = {
    index: Alignment.CENTER,
    warehouseExportProposals: Alignment.LEFT,
    orderCode: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    orderCreatedAt: Alignment.CENTER,
    planQuantity: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    actualQuantity: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    status: Alignment.LEFT,
  };

  const model: ReportModel<ReportOrderImportByRequestForItemModel> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: REPORT_ORDER_IMPORT_BY_REQUEST_FOR_ITEM_MODEL,
    tableData: data.dataMapped,
    header: false,
    aligmentCell: formatByKey,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request?.warehouseCode ? data.warehouseName : null,
    key: REPORT_INFO[ReportType[ReportType.ORDER_IMPORT_BY_REQUEST_FOR_ITEM]]
      ?.key,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportGroupByWarehouseTemplateData,
    i18n,
  );

  return {
    dataBase64,
    nameFile,
  };
}

async function getStatus(data: ReportOrderItem, i18n) {
  const stockQuantity = minus(data.planQuantity, data.actualQuantity);
}
