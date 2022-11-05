import { InventoryModel } from '@models/inventory.model';
import { ItemImportedButNotStoreToPositionModel } from '@models/Item-imported-but-not-put-to-position.model';
import { TableData } from '@models/report.model';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getItemImportedButNotPutToPositionMapped(
  data: any[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableData<ItemImportedButNotStoreToPositionModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?._id?.companyName || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: '',
    dataMapped: null,
  };

  const dataExcell = data[0]?.warehouses?.map((wh) => {
    wh.items = wh?.items?.map((item) => {
      const dataReturn: ItemImportedButNotStoreToPositionModel = {
        index: 0,
        orderCode: item.orderCode,
        ebsNumber: item.ebsNumber,
        reason: item.reason,
        explain: item.explain,
        itemCode: item.itemCode,
        itemName: item.itemName,
        unit: item.unit,
        lotNumber: item.lotNumber,
        planQuantity: item.planQuantity,
        actualQuantity: item.actualQuantity,
        remainQuantity: item.remainQuantity,
        note: item.note,
        performerName: item.performerName,
      };
      return dataReturn;
    });

    return {
      warehouseCode:
        i18n.translate('report.WAREHOUSE_GROUP_CODE') +
        [wh?.warehouseCode, wh?.warehouseName]?.join('_'),
      data: wh?.items,
    };
  });
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
