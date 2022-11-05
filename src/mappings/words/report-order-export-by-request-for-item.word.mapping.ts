import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportOrderExportByRequestForItem } from '@layout/word/report-order-export-by-request-for-item.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportOrderExportByRequestForItemModel } from '@models/order-export-by-request-for-item.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderExportByRequestForItemWordMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportOrderExportByRequestForItemModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ORDER_EXPORT_BY_REQUEST_FOR_ITEM]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportOrderExportByRequestForItem(
      data.dataMapped,
      i18n,
    ),
  };
}
