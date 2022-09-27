import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_INVENTORY_PERIOD_COLUMN } from '@layout/excel/table-column-excel/report-situation-inventory-period-column';
import { reportSituationInventoryPeriodTemplateData } from '@layout/excel/table-data-excel/report-situation-inventory-period.template-data';
import { ReportModel } from '@models/report.model';
import { TableDataSituationInventoryPeriod } from '@models/statistic-inventory.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationInventoryPeriodExcelMapping(
  request: ReportRequest,
  data: ReportOrderItemLot[],
  i18n: I18nRequestScopeService,
) {
  let companyName = '';
  let companyAddress = '';
  let warehouseName = '';
  let dataExcell: TableDataSituationInventoryPeriod[] = data.map(
    (item: any) => {
      companyName = item._id.companyName;
      companyAddress = item._id.companyAddress;
      warehouseName = item._id.warehouseName;
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item._id.warehouseCode, item._id.warehouseName].join('_'),
        totalPlanQuantity: item.totalPlanQuantity,
        totalActualQuantity: item.totalActualQuantity,
        items: item.items,
      };
    },
  );
  const model: ReportModel<any> = {
    childCompany: companyName,
    addressChildCompany: companyAddress,
    tableData: dataExcell,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_INVENTORY_PERIOD]].key,
    warehouse: request.warehouseId ? warehouseName : null,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    tableColumn: SITUATION_INVENTORY_PERIOD_COLUMN,
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
