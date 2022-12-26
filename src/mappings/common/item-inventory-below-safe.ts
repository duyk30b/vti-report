import { ReportInventoryBelowSafeModel } from '@models/item-inventory-below-safe.model';
import { TableData } from '@models/report.model';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getItemInventoryBelowSafe(
  data: DailyWarehouseItemStock[],
  i18n: I18nRequestScopeService,
  isEmpty: boolean,
): ReportInfo<TableData<ReportInventoryBelowSafeModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?.companyName?.toUpperCase() || '',
    companyCode: data[0]?.companyCode || '',
    companyAddress: data[0]?.companyAddress || '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: null,
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
        inventoryLimit: cur.inventoryLimit,
        stockQuantity: cur.stockQuantity,
      });
      return prev;
    }, {});
    const dataExcell: TableData<ReportInventoryBelowSafeModel>[] = [];

    for (const key in groupByWarehouseCode) {
      dataExcell.push({
        warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
        data: groupByWarehouseCode[key],
      });
    }

    dataMaping.dataMapped = dataExcell || [];
  } else {
    dataMaping.dataMapped = [];
  }

  return dataMaping;
}
