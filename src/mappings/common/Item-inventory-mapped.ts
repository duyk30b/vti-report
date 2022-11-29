import { ItemInventoryModel } from '@models/item-inventory.model';
import { TableData } from '@models/report.model';
import { I18nRequestScopeService } from 'nestjs-i18n';

export interface ReportInfo<T> {
  companyName: string;
  companyAddress: string;
  warehouseName: string;
  dataMapped: T;
}
export function getItemInventoryDataMapping(
  data: any,
  i18n: I18nRequestScopeService,
  isEmpty: boolean,
): ReportInfo<ItemInventoryModel> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?.companyName || '',
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
      const returnData: ItemInventoryModel = {
        index: 0,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        lotNumber: cur.lotNumber,
        storageCost: cur.storageCost || null,
        stockStart: cur.stockStart || null,
        totalStockStart: cur.totalStockStart || null,
        importIn: cur.importIn || null,
        totalImportIn: cur.totalImportIn || null,
        exportIn: cur.exportIn || null,
        totalExportIn: cur.totalExportIn || null,
        stockEnd: cur.stockEnd || null,
        totalStockEnd: cur.totalStockEnd || null,
        note: cur.note,
      };
      prev[warehouseCode].push(returnData);
      return prev;
    }, {});
    const dataExcell: TableData<ItemInventoryModel>[] = [];

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
