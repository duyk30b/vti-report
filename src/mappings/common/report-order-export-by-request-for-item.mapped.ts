import { ReportOrderExportByRequestForItemModel } from '@models/order-export-by-request-for-item.model';
import { TableData } from '@models/report.model';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import * as moment from 'moment';
import { DATE_FOMAT_EXCELL_MM_DD_YY } from '@utils/constant';
import { readDecimal } from '@constant/common';
import { WAREHOUSE_EXPORT_RECEIPT_STATUS_MAP } from '@enums/order-status.enum';

export function getOrderExportByRequestForItemMapped(
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
  isEmptyInput: boolean,
  reportType?: number,
): ReportInfo<TableData<ReportOrderExportByRequestForItemModel>[]> {
  const dataMaping: ReportInfo<any> = {
    companyCode: data[0]?.companyCode,
    companyName: data[0]?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?.companyAddress || '',
    warehouseName: data[0]?.warehouseName || '',
    dataMapped: null,
  };

  if (!isEmptyInput) {
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
          ? moment(cur.orderCreatedAt).format(DATE_FOMAT_EXCELL_MM_DD_YY)
          : '',
        planQuantity: readDecimal(cur.planQuantity, true),
        exportedQuantity: readDecimal(cur.actualQuantity, true),
        status: i18n.translate(
          `report.${WAREHOUSE_EXPORT_RECEIPT_STATUS_MAP[cur?.status]}`,
        ),
      };
      prev[warehouseCode].push(data);
      return prev;
    }, {});
    const dataExcell: TableData<ReportOrderExportByRequestForItemModel>[] = [];

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
