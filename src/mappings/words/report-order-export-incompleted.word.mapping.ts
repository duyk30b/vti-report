import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportOrderExportIncompleted } from '@layout/word/report-order-exported-incomplete.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { OrderExportIncompleteModel } from '@models/order-exported-incomplete.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderExportIncompletedWordMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<OrderExportIncompleteModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ORDER_EXPORT_INCOMPLETED]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportOrderExportIncompleted(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
