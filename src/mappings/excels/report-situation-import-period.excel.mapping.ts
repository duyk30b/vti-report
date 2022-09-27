import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_IMPORT_PERIOD_COLUMN } from '@layout/excel/table-column-excel/report-situation-import-period-column';
import { reportSituationImportPeriodTemplateData } from '@layout/excel/table-data-excel/report-situation-import-period.template-data';
import { ReportModel } from '@models/report.model';
import { TableDataSituationImportPeriod } from '@models/situation_import.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationImportPeriodExcelMapping(
  request: ReportRequest,
  data: any[],
  i18n: I18nRequestScopeService,
) {
  const dataExcell: TableDataSituationImportPeriod = data[0]['warehouses'].map(
    (item) => {
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item.warehouseCode, item.warehouseName].join('_'),
        totalPrice: item.totalPrice,
        purposes: item.purposes,
      };
    },
  );
  const model: ReportModel<any> = {
    childCompany: data[0].companyName,
    addressChildCompany: data[0].companyAddress,
    tableColumn: SITUATION_IMPORT_PERIOD_COLUMN,
    tableData: dataExcell,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_IMPORT_PERIOD]].key,
    warehouse: request.warehouseId ? data[0].warehouseName : null,
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
