import { readDecimal } from '@constant/common';
import { TableAgeOfItems } from '@models/age-of-items.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getSituationTransferMapped(
  data: any[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableAgeOfItems[]> {
  const dataMaping: ReportInfo<TableAgeOfItems[]> = {
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: '',
    dataMapped: null,
  };

  let dataExcell: TableAgeOfItems[] = [];
  if (data.length > 0) {
    dataExcell = data[0]?.warehouses?.map((item: any) => {  
      dataMaping.warehouseName = item.warehouseName;
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
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
