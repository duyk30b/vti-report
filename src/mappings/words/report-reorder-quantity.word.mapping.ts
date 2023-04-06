import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportReorderQuantity } from '@layout/word/report-reorder-quantity.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportReorderQuantity(
  request: ReportRequest,
  data: ReportInfo<any>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.REORDER_QUANTITY]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );

  return {
    nameFile: nameFile,
    result: await generateReportReorderQuantity(
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
