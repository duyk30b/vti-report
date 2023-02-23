import { formatMoney } from '@constant/common';
import { InventoryModel } from '@models/inventory.model';
import { TableData } from '@models/report.model';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { div, minus, plus } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getInventoryDataMapping(
  data: DailyLotLocatorStock[],
  i18n: I18nRequestScopeService,
  inforListItem?: {},
  transactionArr?: {},
): ReportInfo<any> {
  const dataMaping: ReportInfo<any> = {
    companyName: '',
    companyAddress: '',
    warehouseName: '',
    dataMapped: null,
  };

  const groupByWarehouseCode = data.reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + '_' + cur.warehouseName;
    if (!prev[warehouseCode]) {
      prev[warehouseCode] = [];
    }
    const keyMapItem = `${cur.warehouseCode}-${cur?.lotNumber || 'null'}-${
      cur.itemCode
    }-${cur.companyCode}`;
    const totalPrice = inforListItem[keyMapItem]?.price || 0;
    let amount = 0;
    const stockQuantity = inforListItem[keyMapItem]?.quantity || 0;
    if (totalPrice && stockQuantity) {
      amount =
        div(
          parseFloat(totalPrice.toFixed()),
          parseFloat(stockQuantity.toFixed(2)) || 1,
        ) || 0;
    }
    const data: InventoryModel = {
      index: 0,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      lotNumber: cur.lotNumber,
      stockQuantity: formatMoney(stockQuantity || 0, 2),
      locatorCode: cur.locatorCode,
      storageCost: formatMoney(amount || 0, 2),
      totalPrice: formatMoney(totalPrice || 0, 2).split(',')[0],
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
