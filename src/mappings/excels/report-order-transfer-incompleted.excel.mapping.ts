import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ORDER_TRANSFER_INCOMPLETE_COLUMN } from '@layout/excel/table-column-excel/report-order-transfer-incomplete-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/reportGroupByWarehouse.template-data';
import { OrderTransferIncompleteModel } from '@models/order-transfer incomplete.model';
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

export async function reportOrderTransferIncompletedExcelMapping(
  request: ReportRequest,
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
) {
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
    if (!prev[warehouseCode]) {
      prev[cur.warehouseCode] = [];
    }
    const data: OrderTransferIncompleteModel = {
      index: 0,
      orderId: cur.orderId,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      planQuantity: cur.planQuantity,
      construction: cur.constructionName,
      performerName: cur.performerName,
    };
    prev[cur.warehouseCode].push(data);
    return prev;
  }, {});
  const dataExcell: TableData<OrderTransferIncompleteModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  const formatByKey: FormatByKey<OrderTransferIncompleteModel> = {
    index: Alignment.CENTER,
    orderId: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    planQuantity: Alignment.RIGHT,
    construction: Alignment.LEFT,
    performerName: Alignment.LEFT,
  };

  const model: ReportModel<OrderTransferIncompleteModel> = {
    parentCompany: i18n.translate('report.PARENT_COMPANY'),
    childCompany: data[0]?.companyName,
    addressChildCompany: data[0]?.companyAddress,
    tableColumn: REPORT_ORDER_TRANSFER_INCOMPLETE_COLUMN,
    tableData: dataExcell,
    header: true,
    columnLevel: 1,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ORDER_TRANSFER_INCOMPLETED]].key,
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
