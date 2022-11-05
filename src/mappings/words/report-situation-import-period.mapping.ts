import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportSituationImportPeriod } from '@layout/word/report-situation-import-period.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { TableDataSituationImportPeriod } from '@models/situation_import.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportSituationImportPeriodMapping(
  request: ReportRequest,
  data: ReportInfo<TableDataSituationImportPeriod[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.SITUATION_IMPORT_PERIOD]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportSituationImportPeriod(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
