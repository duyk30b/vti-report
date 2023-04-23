import { readDecimal } from '@constant/common';
import { ReportInventoryBelowMinimumModel } from '@models/item-inventory-below-minimum.model';
import { TableData } from '@models/report.model';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getItemInventoryBelowMinimum(
  data: DailyWarehouseItemStock[],
  i18n: I18nRequestScopeService,
  isEmpty: boolean,
  reportType?: number,
): ReportInfo<TableData<ReportInventoryBelowMinimumModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?.companyName?.toUpperCase() || '',
    companyCode: data[0]?.companyCode || '',
    companyAddress: data[0]?.companyAddress || '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: [],
  };

  if (!isEmpty) {
    const groupByWarehouseCode = data.reduce((prev, cur) => {
      const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
      if (!prev[warehouseCode]) {
        prev[warehouseCode] = [];
      }
      prev[warehouseCode].push({
        index: 0,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        minInventoryLimit: readDecimal(cur.minInventoryLimit, true),
        stockQuantity: readDecimal(cur.stockQuantity, true),
      });
      return prev;
    }, {});
    const dataExcell: TableData<ReportInventoryBelowMinimumModel>[] = [];

    for (const key in groupByWarehouseCode) {
      dataExcell.push({
        warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
        data: groupByWarehouseCode[key],
        reportType: reportType || 0,
      });
    }
    dataMaping.dataMapped = dataExcell || [];
  } else {
    dataMaping.dataMapped = [];
  }

  return dataMaping;
}
