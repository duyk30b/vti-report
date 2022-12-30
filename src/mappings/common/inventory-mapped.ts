import { readDecimal } from '@constant/common';
import { InventoryModel } from '@models/inventory.model';
import { TableData } from '@models/report.model';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { mul } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getInventoryDataMapping(
  data: DailyLotLocatorStock[],
  i18n: I18nRequestScopeService,
): ReportInfo<any> {
  const dataMaping: ReportInfo<any> = {
    companyName: '',
    companyAddress: '',
    warehouseName: '',
    dataMapped: null,
  };

  const groupByWarehouseCode = data.filter((item) => item?.stockQuantity
    ).reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + '_' + cur.warehouseName;
    if (!prev[warehouseCode]) {
      prev[warehouseCode] = [];
    }
    const data: InventoryModel = {
      index: 0,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      lotNumber: cur.lotNumber,
      stockQuantity: readDecimal(cur.stockQuantity, true),
      locatorCode: cur.locatorCode,
      storageCost: readDecimal(cur.storageCost),
      totalPrice: readDecimal(mul(cur.storageCost, cur.stockQuantity)),
    };
    prev[warehouseCode].push(data);
    return prev;
  }, {});
  const dataExcell: TableData<InventoryModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
