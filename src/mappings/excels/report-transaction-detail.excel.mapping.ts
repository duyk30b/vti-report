import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { TRANSACTION_DETAIL_COLUMN } from '@layout/excel/table-column-excel/report-transaction-detail-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { FormatByKey, Alignment, ReportModel } from '@models/report.model';
import { TransactionDetailModel } from '@models/transaction-detail.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportTransactionDetailExcelMapping(
  request: ReportRequest,
  data: ReportInfo<any>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<TransactionDetailModel> = {
    warehouseName: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    quantity: Alignment.RIGHT,
    storageCost: Alignment.RIGHT,
    amount: Alignment.RIGHT,
    manufacturingCountry: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    ebsNumber: Alignment.LEFT,
    typeTransaction: Alignment.LEFT,
    orderCreatedAt: Alignment.CENTER,
    reason: Alignment.LEFT,
    source: Alignment.LEFT,
    contractNumber: Alignment.LEFT,
    vendor: Alignment.LEFT,
    construction: Alignment.LEFT,
    explain: Alignment.LEFT,
  };

  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: TRANSACTION_DETAIL_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.TRANSACTION_DETAIL]].key,
    dateFrom: request.dateFrom,
    dateTo: request?.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    reportType: request?.reportType,
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
