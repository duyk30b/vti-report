import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_EXPORT_PERIOD_COLUMN } from '@layout/excel/table-column-excel/report-situation-export-period-column';
import { reportSituationExportPeriodTemplateData } from '@layout/excel/table-data-excel/report-situation-export-period.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportModel } from '@models/report.model';
import { TableDataSituationExportPeriod } from '@models/situation_export.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationExportPeriodExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableDataSituationExportPeriod[]>,
  i18n: I18nRequestScopeService,
) {
  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: SITUATION_EXPORT_PERIOD_COLUMN,
    tableData: data.dataMapped,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_EXPORT_PERIOD]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    reportType: request?.reportType || 0,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportSituationExportPeriodTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
