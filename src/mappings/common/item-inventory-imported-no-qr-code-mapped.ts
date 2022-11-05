import { ItemInventoryImportedNoQRCodeModel } from '@models/Item-inventory-imported-no-qr-code.model';
import { TableData } from '@models/report.model';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getItemInventoryImportedNoQRCodeMapping(
  data: ReportOrderItemLot[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableData<ItemInventoryImportedNoQRCodeModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?.companyName,
    companyAddress: data[0]?.companyAddress,
    warehouseName: data[0]?.warehouseName,
    dataMapped: null,
  };

  const groupByWarehouseCode = data.reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
    if (!prev[warehouseCode]) {
      prev[warehouseCode] = [];
    }
    const data: ItemInventoryImportedNoQRCodeModel = {
      index: 0,
      orderCode: cur.orderCode,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      lotNumber: cur.lotNumber,
      locatorCode: cur.locatorCode,
      actualQuantity: cur.actualQuantity,
      storageCost: cur.storageCost,
      totalPrice: cur.actualQuantity * cur.storageCost,
    };
    prev[warehouseCode].push(data);
    return prev;
  }, {});
  const dataExcell: TableData<ItemInventoryImportedNoQRCodeModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
