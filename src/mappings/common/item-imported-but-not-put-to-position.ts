import { readDecimal } from '@constant/common';
import { ItemImportedButNotStoreToPositionModel } from '@models/Item-imported-but-not-put-to-position.model';
import { TableData } from '@models/report.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getItemImportedButNotPutToPositionMapped(
  data: any[],
  i18n: I18nRequestScopeService,
  reportType?: number,
): ReportInfo<TableData<ItemImportedButNotStoreToPositionModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyCode: data[0]?._id?.companyCode || '',
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: data[0]?._id?.warehouseName,
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
        recievedQuantity: readDecimal(item.recievedQuantity, true),
        actualQuantity: readDecimal(item.actualQuantity, true),
        remainQuantity: readDecimal(item.remainQuantity, true),
        note: item.note,
        performerName: item.performerName,
      };
      return dataReturn;
    });
    dataMaping.warehouseName = wh?.warehouseName
    return {
      warehouseCode:
        i18n.translate('report.WAREHOUSE_GROUP_CODE') +
        [wh?.warehouseCode, wh?.warehouseName]?.join('_'),
      data: wh?.items,
      reportType: reportType || 0,
    };
  });
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
