import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { ITEM_INVENTORY_IMPORTED_NO_QR_CODE_COLUMN } from '@layout/excel/table-column-excel/Item-inventory-imported-no-qr-code-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ItemInventoryImportedNoQRCodeModel } from '@models/Item-inventory-imported-no-qr-code.model';
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

export async function reportItemInventoryImportedNoQRCodeExcelMapping(
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
      const data: ItemInventoryImportedNoQRCodeModel = {
        index: 0,
        orderCode: cur.orderCode,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        lotNumber: cur.lotNumber,
        locatorCode: cur.locatorCode,
        actualQuantity: cur.actualQuantity,
        unitPrice: cur.storageCost,
        totalPrice: cur.actualQuantity * cur.storageCost,
      };
      prev[warehouseCode].push(data);
      return prev;
    }
  }, {});
  const dataExcell: TableData<ItemInventoryImportedNoQRCodeModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  const formatByKey: FormatByKey<ItemInventoryImportedNoQRCodeModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    locatorCode: Alignment.LEFT,
    actualQuantity: Alignment.RIGHT,
    unitPrice: Alignment.RIGHT,
    totalPrice: Alignment.RIGHT,
  };

  const model: ReportModel<ItemInventoryImportedNoQRCodeModel> = {
    childCompany: data[0].companyName,
    addressChildCompany: data[0].companyAddress,
    tableColumn: ITEM_INVENTORY_IMPORTED_NO_QR_CODE_COLUMN,
    tableData: dataExcell,
    header: false,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_IMPORTED_NO_QR_CODE]]
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
    dataBase64,
    nameFile,
  };
}
