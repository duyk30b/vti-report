import { TableDataSituationImportPeriod } from '@models/situation_import.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getSituationImportPeriod(
  data: any[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableDataSituationImportPeriod[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: data[0]?._id?.warehouseName || '',
    dataMapped: null,
  };

  let dataExcell: TableDataSituationImportPeriod[] = [];
  if (data[0]?.warehouses) {
    dataExcell = data[0]?.warehouses?.map((item) => {
      dataMaping.warehouseName = item.warehouseName;
      const tempt: TableDataSituationImportPeriod = {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item.warehouseCode, item.warehouseName].join('_'),
        totalPrice: item.totalPrice,
        reasons: item.reasons,
      };
      return tempt;
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
