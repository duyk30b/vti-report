import { TableDataSituationTransfer } from '@models/situation-transfer.model';
import { TableDataSituationInventoryPeriod } from '@models/statistic-inventory.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getSituationInventoryPeriod(
  data: any[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableDataSituationInventoryPeriod[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?._id?.companyName || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: data[0]?._id?.warehouseName || '',
    dataMapped: null,
  };

  let dataExcell: TableDataSituationInventoryPeriod[] = data.map(
    (item: any) => {
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
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
