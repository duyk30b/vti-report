import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_IMPORT_PERIOD_COLUMN } from '@layout/excel/table-column-excel/report-situation-import-period-column';
import { reportSituationImportPeriodTemplateData } from '@layout/excel/table-data-excel/report-situation-import-period.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportModel } from '@models/report.model';
import { TableDataSituationImportPeriod } from '@models/situation_import.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationImportPeriodExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableDataSituationImportPeriod[]>,
  i18n: I18nRequestScopeService,
) {
  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: SITUATION_IMPORT_PERIOD_COLUMN,
    tableData: data.dataMapped,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_IMPORT_PERIOD]].key,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportSituationImportPeriodTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
