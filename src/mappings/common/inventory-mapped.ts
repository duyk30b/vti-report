import { formatMoney } from '@constant/common';
import { InventoryModel } from '@models/inventory.model';
import { TableData } from '@models/report.model';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { divBigNumber, mulBigNumber, plusBigNumber } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getInventoryDataMapping(
  data: DailyLotLocatorStock[],
  i18n: I18nRequestScopeService,
  inforListItem?: {},
  listTransaction?: {},
): ReportInfo<any> {
  const dataMaping: ReportInfo<any> = {
    companyName: '',
    companyAddress: '',
    warehouseName: '',
    dataMapped: null,
  };

  const groupByWarehouseCode = data.reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + '_' + cur.warehouseName;
    dataMaping.warehouseName = cur.warehouseName;
    if (!prev[warehouseCode]) {
      prev[warehouseCode] = [];
    }
    const keyMapItem = `${cur.warehouseCode}-${cur?.lotNumber || 'null'}-${
      cur.itemCode
    }-${cur.companyCode}`;

    const keyMapLocator = `${cur.warehouseCode}-${cur?.lotNumber || 'null'}-${
      cur.itemCode
    }-${cur.companyCode}-${cur?.locatorCode}-${cur?.companyCode}`;

    const totalPrice = inforListItem[keyMapItem]?.price || 0;
    let averagePrice = 0;
    let stockQuantity = cur.stockQuantity || 0;
    let totalAmount = 0;

    if (totalPrice && inforListItem[keyMapItem]?.quantity) {
      averagePrice = divBigNumber(
        totalPrice,
        inforListItem[keyMapItem]?.quantity,
      );
    }
    const quantityTransaction =
      listTransaction[keyMapLocator]?.stockQuantity || 0;
    stockQuantity = plusBigNumber(stockQuantity, quantityTransaction);
    totalAmount = mulBigNumber(averagePrice, stockQuantity);
    const data: InventoryModel = {
      index: 0,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      lotNumber: cur.lotNumber,
      manufacturingCountry:
        inforListItem[keyMapItem]?.manufacturingCountry || '',
      locatorCode: cur.locatorCode,
      stockQuantity: formatMoney(stockQuantity || 0, 2),
      storageCost: formatMoney(averagePrice || 0, 2),
      totalPrice: formatMoney(totalAmount || 0),
    };
    if (Number(stockQuantity) > 0) prev[warehouseCode].push(data);
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
