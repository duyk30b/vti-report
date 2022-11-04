import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_EXPORT_PERIOD_COLUMN } from '@layout/excel/table-column-excel/report-situation-export-period-column';
import { reportSituationExportPeriodTemplateData } from '@layout/excel/table-data-excel/report-situation-export-period.template-data';
import { ReportModel } from '@models/report.model';
import { TableDataSituationExportPeriod } from '@models/situation_export.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationExportPeriodExcelMapping(
  request: ReportRequest,
  data: any[],
  i18n: I18nRequestScopeService,
) {
  let dataExcell: TableDataSituationExportPeriod[] = [];
  if (data.length > 0) {
    dataExcell = data[0]['warehouses'].map((item) => {
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item.warehouseCode, item.warehouseName].join('_'),
        totalPrice: item.totalPrice,
        reasons: item.reasons,
      };
    });
  }
  const model: ReportModel<any> = {
    childCompany: data[0]?._id?.companyName || '',
    addressChildCompany: data[0]?._id?.companyAddress || '',
    tableColumn: SITUATION_EXPORT_PERIOD_COLUMN,
    tableData: dataExcell,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_EXPORT_PERIOD]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseId ? data[0].warehouseName : null,
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
