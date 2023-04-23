import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportSituationInventoryPeriod } from '@layout/word/report-situation-inventory-period.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { TableDataSituationInventoryPeriod } from '@models/statistic-inventory.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportSituationInventoryPeriodMapping(
  request: ReportRequest,
  data: ReportInfo<TableDataSituationInventoryPeriod[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.SITUATION_INVENTORY_PERIOD]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );

  return {
    nameFile: nameFile,
    result: await generateReportSituationInventoryPeriod(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
