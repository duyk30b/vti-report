import { InventoryModel } from '@models/inventory.model';
import { ReportInventoryBelowMinimumModel } from '@models/item-inventory-below-minimum.model';
import { OrderExportIncompleteModel } from '@models/order-exported-incomplete.model';
import { TableData } from '@models/report.model';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export function getOrderExportIncompletedMapped(
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
  isEmpty: boolean,
): ReportInfo<TableData<OrderExportIncompleteModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyCode: data[0]?.companyCode || '',
    companyName: data[0]?.companyName || '',
    companyAddress: data[0]?.companyAddress || '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: null,
  };
  if (!isEmpty) {
    const groupByWarehouseCode = data.reduce((prev, cur) => {
      if (cur.warehouseCode && cur.warehouseName) {
        const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
        if (!prev[warehouseCode]) {
          prev[warehouseCode] = [];
        }
        const data: OrderExportIncompleteModel = {
          index: 0,
          orderCode: cur.orderCode,
          itemCode: cur.itemCode,
          itemName: cur.itemName,
          unit: cur.unit,
          actualQuantity: cur.actualQuantity,
          constructionName: cur.constructionName,
          receiver: cur.performerName,
        };
        prev[warehouseCode].push(data);
        return prev;
      }
    }, {});
    const dataExcell: TableData<OrderExportIncompleteModel>[] = [];

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
