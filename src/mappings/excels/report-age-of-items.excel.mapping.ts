import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { AGE_OF_ITEMS_COLUMN } from '@layout/excel/table-column-excel/report-age-of-items-column';
import { reportAgeOfItemsTemplateData } from '@layout/excel/table-data-excel/report-age-of-items.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { TableAgeOfItems } from '@models/age-of-items.model';
import { ReportModel } from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportAgeOfItemsExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableAgeOfItems[]>,
  i18n: I18nRequestScopeService,
) {
  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: AGE_OF_ITEMS_COLUMN,
    tableData: data.dataMapped,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.AGE_OF_ITEM_STOCK]].key,
    dateFrom: request.dateFrom,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    reportType: request?.reportType || 0,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportAgeOfItemsTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
