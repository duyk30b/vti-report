import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { AGE_OF_ITEMS_COLUMN } from '@layout/excel/table-column-excel/report-age-of-items-column';
import { reportAgeOfItemsTemplateData } from '@layout/excel/table-data-excel/report-age-of-items.template-data';
import { TableAgeOfItems } from '@models/age-of-items.model';
import { ReportModel } from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportAgeOfItemsExcelMapping(
  request: ReportRequest,
  data: any[],
  i18n: I18nRequestScopeService,
) {
  const companyName = data[0]?._id?.companyName;
  const companyAddress = data[0]?._id?.companyAddress;
  let warehouseName = null;
  let dataExcell: TableAgeOfItems[] = data[0].warehouses.map((item: any) => {
    warehouseName = item.warehouseName;
    return {
      warehouseCode:
        i18n.translate('report.WAREHOUSE_GROUP_CODE') +
        [item.warehouseCode, item.warehouseName].join('_'),
      sixMonth: item.sixMonth,
      oneYearAgo: item.oneYearAgo,
      twoYearAgo: item.twoYearAgo,
      threeYearAgo: item.threeYearAgo,
      fourYearAgo: item.fourYearAgo,
      fiveYearAgo: item.fiveYearAgo,
      greaterfiveYear: item.greaterfiveYear,
      totalPrice: item.totalPrice,
      items: item.items,
    };
  });

  const model: ReportModel<any> = {
    childCompany: companyName,
    addressChildCompany: companyAddress,
    tableColumn: AGE_OF_ITEMS_COLUMN,
    tableData: dataExcell,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.AGE_OF_ITEM_STOCK]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseId ? warehouseName : null,
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
