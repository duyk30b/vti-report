import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generatereportOrderTransferIncompleted } from '@layout/word/report-order-transfer-incomplete.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { OrderTransferIncompleteModel } from '@models/order-transfer incomplete.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderTransferIncompletedWordMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<OrderTransferIncompleteModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile, title, sheetName, reportTime } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ORDER_TRANSFER_INCOMPLETED]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generatereportOrderTransferIncompleted(
      data.dataMapped,
      data.companyName,
      data.companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
