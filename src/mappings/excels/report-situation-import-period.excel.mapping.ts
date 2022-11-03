import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_IMPORT_PERIOD_COLUMN } from '@layout/excel/table-column-excel/report-situation-import-period-column';
import { reportSituationImportPeriodTemplateData } from '@layout/excel/table-data-excel/report-situation-import-period.template-data';
import { ReportModel } from '@models/report.model';
import { TableDataSituationImportPeriod } from '@models/situation_import.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationImportPeriodExcelMapping(
  request: ReportRequest,
  data: any[],
  i18n: I18nRequestScopeService,
) {
  let warehouseName;
  let companyName = data[0]?._id?.companyName;
  let companyAddress = data[0]?._id?.companyAddress;
  let dataExcell = [];
  if (data[0]?.warehouses) {
    dataExcell = data[0]['warehouses'].map((item) => {
      warehouseName = item.warehouseName;
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
    childCompany: companyName,
    addressChildCompany: companyAddress,
    tableColumn: SITUATION_IMPORT_PERIOD_COLUMN,
    tableData: dataExcell,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_IMPORT_PERIOD]].key,
    warehouse: request.warehouseId ? warehouseName : null,
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
