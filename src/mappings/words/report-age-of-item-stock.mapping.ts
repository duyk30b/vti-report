import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportAgeOfItemStock } from '@layout/word/report-age-of-items.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { TableAgeOfItems } from '@models/age-of-items.model';
import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportAgeOfItemsMapping(
  request: ReportRequest,
  data: ReportInfo<TableAgeOfItems[]>,
  i18n: I18nRequestScopeService,
) {
  const { nameFile, title, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.AGE_OF_ITEM_STOCK]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportAgeOfItemStock(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
