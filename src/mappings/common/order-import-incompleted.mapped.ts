import { formatMoney, readDecimal } from '@constant/common';
import { OrderImportIncompleteModel } from '@models/order-import-incomplete.model';
import { TableData } from '@models/report.model';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
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
        actualQuantity: readDecimal(cur.receivedQuantity),
        storageCost: formatMoney(cur.storageCost, 2),
        totalPrice: formatMoney(cur?.amount),
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
