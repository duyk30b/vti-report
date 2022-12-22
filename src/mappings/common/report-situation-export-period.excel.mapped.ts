import { TableDataSituationExportPeriod } from '@models/situation_export.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getSituationExportPeriodMapped(
  data: any[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableDataSituationExportPeriod[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: data[0]?._id?.warehouseName || '',
    dataMapped: null,
  };

  let dataExcell: TableDataSituationExportPeriod[] = [];
  if (data.length > 0) {
    dataExcell = data[0]?.warehouses?.map((item) => {
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item.warehouseCode, item.warehouseName].join('_'),
        totalPrice: item.totalPrice,
        reasons: item.reasons,
      };
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
