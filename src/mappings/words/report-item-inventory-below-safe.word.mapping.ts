import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generatereportItemInventoryBelowSafe } from '@layout/word/report-inventory-below-safe.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportInventoryBelowSafeModel } from '@models/item-inventory-below-safe.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryBelowSafeWordMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportInventoryBelowSafeModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_BELOW_SAFE]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
  );

  return {
    nameFile: nameFile,
    result: await generatereportItemInventoryBelowSafe(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
