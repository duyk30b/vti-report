import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_INVENTORY_PERIOD_COLUMN } from '@layout/excel/table-column-excel/report-situation-inventory-period-column';
import { reportSituationInventoryPeriodTemplateData } from '@layout/excel/table-data-excel/report-situation-inventory-period.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportModel } from '@models/report.model';
import { TableDataSituationInventoryPeriod } from '@models/statistic-inventory.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationInventoryPeriodExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableDataSituationInventoryPeriod[]>,
  i18n: I18nRequestScopeService,
) {
  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableData: data.dataMapped,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_INVENTORY_PERIOD]].key,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    tableColumn: SITUATION_INVENTORY_PERIOD_COLUMN,
    reportType: request?.reportType || 0,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportSituationInventoryPeriodTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
