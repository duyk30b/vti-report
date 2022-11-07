import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportItemInventoryBelowMinimum } from '@layout/word/report-inventory-below-minimum.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportInventoryBelowMinimumModel } from '@models/item-inventory-below-minimum.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryBelowMinimumWordMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportInventoryBelowMinimumModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_BELOW_MINIMUM]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportItemInventoryBelowMinimum(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
