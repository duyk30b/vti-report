import { OrderTransferIncompleteModel } from '@models/order-transfer incomplete.model';
import { TableData } from '@models/report.model';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getOrderTransferIncompletedMapped(
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
  isEmpty: boolean,
): ReportInfo<TableData<OrderTransferIncompleteModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?.companyName || '',
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
      const data: OrderTransferIncompleteModel = {
        index: 0,
        orderCode: cur.orderCode,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        actualQuantity: cur.actualQuantity,
        constructionName: cur.constructionName,
        warehouseImport:
          cur.warehouseTargetName && cur.warehouseTargetCode
            ? [cur.warehouseTargetName, cur.warehouseTargetCode].join('_')
            : '',
      };
      prev[warehouseCode].push(data);
      return prev;
    }, {});
    const dataExcell: TableData<OrderTransferIncompleteModel>[] = [];

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
