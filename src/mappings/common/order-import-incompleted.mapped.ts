import { formatMoney, readDecimal } from '@constant/common';
import { InventoryModel } from '@models/inventory.model';
import { ReportInventoryBelowMinimumModel } from '@models/item-inventory-below-minimum.model';
import { OrderExportIncompleteModel } from '@models/order-exported-incomplete.model';
import { OrderImportIncompleteModel } from '@models/order-import-incomplete.model';
import { TableData } from '@models/report.model';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import { getTimezone } from '@utils/common';

export function getOrderImportIncompletedMapped(
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
  isEmpty: boolean,
  reportType?: number,
): ReportInfo<TableData<OrderImportIncompleteModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyCode: data[0]?.companyCode || '',
    companyName: data[0]?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?.companyAddress || '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: null,
  };

  if (!isEmpty) {
    const groupByWarehouseCode = data.reduce((prev, cur) => {
      const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
      const date = getTimezone(cur.orderCreatedAt, 'DD/MM/YYYY') || '';
      if (!prev[warehouseCode]) {
        prev[warehouseCode] = [];
      }
      const data: OrderImportIncompleteModel = {
        index: 0,
        orderCode: cur.orderCode,
        orderCreatedAt: date,
        departmentReceiptName: cur.departmentReceiptName,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        actualQuantity: readDecimal(cur.receivedQuantity, true),
        storageCost: formatMoney(cur.storageCost, true),
        totalPrice: formatMoney(cur.storageCost * cur.planQuantity, true),
        constructionName: cur.constructionName,
        deliverName: cur.performerName,
      };
      prev[warehouseCode].push(data);
      return prev;
    }, {});
    const dataExcell: TableData<OrderImportIncompleteModel>[] = [];

    for (const key in groupByWarehouseCode) {
      dataExcell.push({
        warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
        data: groupByWarehouseCode[key],
        reportType: reportType || 0,
      });
    }

    dataMaping.dataMapped = dataExcell || [];
  } else {
    dataMaping.dataMapped = [];
  }

  return dataMaping;
}
