import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportItemImportedButNotPutToPosition } from '@layout/word/report-Item-imported-but-not-put-to-position.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ItemImportedButNotStoreToPositionModel } from '@models/Item-imported-but-not-put-to-position.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemImportedButNotPutToPositionMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ItemImportedButNotStoreToPositionModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION]]
      .key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportItemImportedButNotPutToPosition(
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
