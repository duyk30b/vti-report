import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_TRANSFER_COLUMN } from '@layout/excel/table-column-excel/report-situation-transfer-column';
import { reportSituationTransferTemplateData } from '@layout/excel/table-data-excel/report-situation-transfer.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportModel } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationTransferExcelMapping(
  request: ReportRequest,
  data: ReportInfo<any>,
  i18n: I18nRequestScopeService,
) {
  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: SITUATION_TRANSFER_COLUMN,
    tableData: data.dataMapped,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_TRANSFER]]?.key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request?.warehouseCode ? data?.warehouseName : null,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportSituationTransferTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
