import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ORDER_IMPORT_BY_REQUEST_FOR_ITEM_MODEL } from '@layout/excel/table-column-excel/report-order-import-by-request-for-item-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportOrderImportByRequestForItemModel } from '@models/order-import-by-request-for-item.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { minus } from '@utils/common';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderImportByRequestForItemExcelMapping(
  request: ReportRequest,
  data: ReportOrderItem[],
  i18n: I18nRequestScopeService,
) {
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
        orderImportRequireCode: cur.orderCode,
        orderCode: cur.orderCode,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        dateImport: cur.planDate,
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

  const formatByKey: FormatByKey<ReportOrderImportByRequestForItemModel> = {
    index: Alignment.CENTER,
    orderImportRequireCode: Alignment.LEFT,
    orderCode: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    dateImport: Alignment.CENTER,
    planQuantity: Alignment.RIGHT,
    actualQuantity: Alignment.RIGHT,
    status: Alignment.LEFT,
  };

  const model: ReportModel<ReportOrderImportByRequestForItemModel> = {
    childCompany: data[0]?.companyName,
    addressChildCompany: data[0]?.companyAddress,
    tableColumn: REPORT_ORDER_IMPORT_BY_REQUEST_FOR_ITEM_MODEL,
    tableData: dataExcell,
    header: false,
    aligmentCell: formatByKey,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request?.warehouseId ? data[0]?.warehouseName : null,
    key: REPORT_INFO[ReportType[ReportType.ORDER_IMPORT_BY_REQUEST_FOR_ITEM]]
      ?.key,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportGroupByWarehouseTemplateData,
    i18n,
  );

  return {
    dataBase64,
    nameFile,
  };
}

async function getStatus(data: ReportOrderItem, i18n) {
  const stockQuantity = minus(data.planQuantity, data.actualQuantity);
}
