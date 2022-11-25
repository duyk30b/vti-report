import { ItemInventoryModel } from '@models/item-inventory.model';
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
): ReportInfo<ItemInventoryModel> {
  const dataMaping: ReportInfo<any> = {
    companyName: '',
    companyAddress: '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: null,
  };

  dataMaping.dataMapped = data[0];
  let dataExcell = [];
  if (dataMaping.dataMapped) {
    dataMaping.companyName = dataMaping['dataMapped']?._id?.companyName || '';
    dataMaping.companyAddress =
      dataMaping['dataMapped']?._id?.companyAddress || '';
    dataExcell = dataMaping['dataMapped']?.warehouses?.map((wh) => {
      wh.items = wh?.items?.map((i) => {
        const returnData: ItemInventoryModel = {
          index: 0,
          itemCode: i.itemCode,
          itemName: i.itemName,
          unit: i.unit,
          lotNumber: i.lotNumber,
          storageCost: i.storageCost || null,
          stockStart: i.stockStart || null,
          totalStockStart: i.totalStockStart || null,
          importIn: i.importIn || null,
          totalImportIn: i.totalImportIn || null,
          exportIn: i.exportIn || null,
          totalExportIn: i.totalExportIn || null,
          stockEnd: i.stockEnd || null,
          totalStockEnd: i.totalStockEnd || null,
          note: i.note,
        };
        return returnData;
      });
      dataMaping.warehouseName = wh.warehouseName;
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [wh.warehouseCode, wh.warehouseName].join('_'),
        data: wh.items,
      };
    });
  }

  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
