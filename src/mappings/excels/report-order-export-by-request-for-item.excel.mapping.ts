import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ORDER_EXPORT_BY_REQUEST_FOR_ITEM_MODEL } from '@layout/excel/table-column-excel/report-order-export-by-request-for-item-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportOrderExportByRequestForItemModel } from '@models/order-export-by-request-for-item.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderExportByRequestForItem(
  request: ReportRequest,
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
) {
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    if (cur.warehouseCode && cur.warehouseName) {
      const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
      if (!prev[warehouseCode]) {
        prev[warehouseCode] = [];
      }
      const data: ReportOrderExportByRequestForItemModel = {
        index: 0,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        orderExportRequireCode: cur.proposalExport,
        orderCode: cur.orderCode,
        dateExported: cur.planDate,
        planQuantity: cur.planQuantity,
        exportedQuantity: cur.exportedQuantity,
      };
      prev[warehouseCode].push(data);
      return prev;
    }
  }, {});
  const dataExcell: TableData<ReportOrderExportByRequestForItemModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  const formatByKey: FormatByKey<ReportOrderExportByRequestForItemModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    orderExportRequireCode: Alignment.LEFT,
    orderCode: Alignment.LEFT,
    dateExported: Alignment.CENTER,
    planQuantity: Alignment.RIGHT,
    exportedQuantity: Alignment.RIGHT,
  };

  const model: ReportModel<ReportOrderExportByRequestForItemModel> = {
    childCompany: data[0].companyName,
    addressChildCompany: data[0].companyAddress,
    tableColumn: REPORT_ORDER_EXPORT_BY_REQUEST_FOR_ITEM_MODEL,
    tableData: dataExcell,
    header: false,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_EXPORT_BY_REQUEST_FOR_ITEM]]
      .key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseId ? data[0].warehouseName : null,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportGroupByWarehouseTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
