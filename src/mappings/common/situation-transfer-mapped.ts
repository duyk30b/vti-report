import { TableDataSituationTransfer } from '@models/situation-transfer.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getSituationTransfer(
  data: any[],
  i18n: I18nRequestScopeService,
): ReportInfo<any> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: '',
    dataMapped: null,
  };

  let dataExcell: TableDataSituationTransfer[] = [];
  if (data[0]?.warehouses) {
    dataExcell = data[0]?.warehouses?.map((item) => {
      dataMaping.warehouseName = item.warehouseName;
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item.warehouseCode, item.warehouseName].join('_'),
        totalPrice: item.totalPrice,
        orders: item.orders,
      };
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
