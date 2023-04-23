import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportOrderImportByRequestForItem } from '@layout/word/report-order-import-by-request-for-item.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportOrderImportByRequestForItemModel } from '@models/order-import-by-request-for-item.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderImportByRequestForItemWordMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportOrderImportByRequestForItemModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ORDER_IMPORT_BY_REQUEST_FOR_ITEM]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportOrderImportByRequestForItem(
      data.dataMapped,
      i18n,
    ),
  };
}
