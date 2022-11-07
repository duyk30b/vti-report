import { ReportOrderExportByRequestForItemModel } from '@models/order-export-by-request-for-item.model';
import { OrderTransferIncompleteModel } from '@models/order-transfer incomplete.model';
import { TableData } from '@models/report.model';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import * as moment from 'moment';
import { DATE_FOMAT_EXCELL } from '@utils/constant';
import { ReportOrderImportByRequestForItemModel } from '@models/order-import-by-request-for-item.model';
import { minus } from '@utils/common';

export function getOrderImportByRequestForItemMapped(
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
): ReportInfo<TableData<ReportOrderImportByRequestForItemModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyName: data[0]?.companyName || '',
    companyAddress: data[0]?.companyAddress || '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: null,
  };

  const textSatus = {
    imported: i18n.translate('report.IMPORTED'),
    importing: i18n.translate('report.IMPORTING'),
    notYetImport: i18n.translate('report.NOT_YET_IMPORT'),
  };
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    if (cur.warehouseCode && cur.warehouseName) {
      const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
      if (!prev[warehouseCode]) {
        prev[warehouseCode] = [];
      }
      const stockQuantity = minus(cur.planQuantity, cur.actualQuantity);
      let status = '';
      if (stockQuantity === 0) {
        status = textSatus.imported;
      } else if (stockQuantity > 0 && stockQuantity < cur.planQuantity) {
        status = textSatus.importing;
      } else if (stockQuantity === cur.planQuantity) {
        status = textSatus.notYetImport;
      }
      const data: ReportOrderImportByRequestForItemModel = {
        index: 0,
        warehouseExportProposals: cur.warehouseExportProposals,
        orderCode: cur.orderCode,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        orderCreatedAt: cur.orderCreatedAt
          ? moment(cur.orderCreatedAt).format(DATE_FOMAT_EXCELL)
          : '',
        planQuantity: cur.planQuantity,
        actualQuantity: cur.actualQuantity,
        status: status,
      };
      prev[warehouseCode].push(data);
      return prev;
    }
  }, {});

  const dataExcell: TableData<ReportOrderImportByRequestForItemModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
