import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportOrderImportIncompleted } from '@layout/word/report-import-incomplete.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { OrderImportIncompleteModel } from '@models/order-import-incomplete.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderImportIncompletedMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<OrderImportIncompleteModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ORDER_IMPORT_INCOMPLETED]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );

  return {
    nameFile: nameFile,
    result: await generateReportOrderImportIncompleted(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      data.companyCode,
      title,
      reportTime,
      i18n,
    ),
  };
}
