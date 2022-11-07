import { ReportOrderExportByRequestForItemModel } from '@models/order-export-by-request-for-item.model';
import { OrderTransferIncompleteModel } from '@models/order-transfer incomplete.model';
import { TableData } from '@models/report.model';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import * as moment from 'moment';
import { DATE_FOMAT_EXCELL } from '@utils/constant';

export function getOrderExportByRequestForItemMapped(
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableData<ReportOrderExportByRequestForItemModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?.companyName || '',
    companyAddress: data[0]?.companyAddress || '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: null,
  };

  const groupByWarehouseCode = data.reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
    if (!prev[warehouseCode]) {
      prev[warehouseCode] = [];
    }
    const data: ReportOrderExportByRequestForItemModel = {
      index: 0,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      warehouseExportProposals: cur.warehouseExportProposals,
      orderCode: cur.orderCode,
      orderCreatedAt: cur.orderCreatedAt
        ? moment(cur.orderCreatedAt).format(DATE_FOMAT_EXCELL)
        : '',
      planQuantity: cur.planQuantity,
      exportedQuantity: cur.exportedQuantity,
    };
    prev[warehouseCode].push(data);
    return prev;
  }, {});
  const dataExcell: TableData<ReportOrderExportByRequestForItemModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
