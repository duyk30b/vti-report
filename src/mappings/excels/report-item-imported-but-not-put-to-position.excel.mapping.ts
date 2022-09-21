import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ITEM_IMPORT_BUT_NOT_PUT_TO_POSITION_COLUMN } from '@layout/excel/table-column-excel/report-Item-imported-but-not-put-to-position-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/reportGroupByWarehouse.template-data';
import { ItemImportedButNotStoreToPositionModel } from '@models/Item-imported-but-not-put-to-position.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemImportedButNotPutToPositionExcelMapping(
  request: ReportRequest,
  data: ReportOrderItemLot[],
  i18n: I18nRequestScopeService,
) {
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    if (cur.warehouseCode && cur.warehouseName) {
      const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
      if (!prev[warehouseCode]) {
        prev[warehouseCode] = [];
      }
      const data: ItemImportedButNotStoreToPositionModel = {
        index: 0,
        orderCode: cur.orderCode,
        orderNumberEbs: cur.orderNumberEbs,
        reason: cur.reason,
        explain: cur.explain,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        lotNumber: cur.lotNumber,
        actualQuantity: cur.actualQuantity,
        receivedQuantity: cur.receivedQuantity,
        receiveQuantity: cur.actualQuantity - cur.receivedQuantity,
        note: cur.note,
        receiver: cur.performerName,
      };
      prev[warehouseCode].push(data);
      return prev;
    }
  }, {});
  const dataExcell: TableData<ItemImportedButNotStoreToPositionModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  const formatByKey: FormatByKey<ItemImportedButNotStoreToPositionModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    orderNumberEbs: Alignment.LEFT,
    reason: Alignment.LEFT,
    explain: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    actualQuantity: Alignment.RIGHT,
    receivedQuantity: Alignment.RIGHT,
    receiveQuantity: Alignment.RIGHT,
    note: Alignment.LEFT,
    receiver: Alignment.RIGHT,
  };

  const model: ReportModel<ItemImportedButNotStoreToPositionModel> = {
    parentCompany: i18n.translate('report.PARENT_COMPANY'),
    childCompany: data[0]?.companyName,
    addressChildCompany: data[0]?.companyAddress,
    tableColumn: REPORT_ITEM_IMPORT_BUT_NOT_PUT_TO_POSITION_COLUMN,
    tableData: dataExcell,
    header: true,
    columnLevel: 1,
    aligmentCell: formatByKey,
    key: REPORT_INFO[
      ReportType[ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION]
    ].key,
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
