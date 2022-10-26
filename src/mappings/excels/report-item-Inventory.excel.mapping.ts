import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { ITEM_INVENTORY_COLUMN } from '@layout/excel/table-column-excel/report-item-inventory';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ItemInventoryModel } from '@models/item-inventory.model';
import {
  Alignment,
  FormatByKey,
  ReportModel,
  TableData,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryExcelMapping(
  request: ReportRequest,
  i18n: I18nRequestScopeService,
  data: any,
) {
  let companyName = '';
  let companyAddress = '';
  let warehouseName;
  const dataExcell: any = data.map((item) => {
    companyName = item._id.companyName;
    companyAddress = item._id.companyAddress;
    warehouseName = item._id.warehouseName;
    item.items = item.items.map((i) => {
      const returnData: ItemInventoryModel = {
        index: 0,
        itemCode: i.itemCode,
        itemName: i.itemName,
        unit: i.unit,
        lotNumber: i.lotNumber,
        storageCost: i.storageCost || 0,
        stockStart: i.stockStart || 0,
        totalStockStart: i.totalStockStart || 0,
        importIn: i.importIn || 0,
        totalImportIn: i.totalImportIn || 0,
        exportIn: i.exportIn || 0,
        totalExportIn: i.totalExportIn || 0,
        stockEnd: i.stockEnd || 0,
        totalStockEnd: i.totalStockEnd || 0,
        note: i.note,
      };
      return returnData;
    });
    return {
      warehouseCode:
        i18n.translate('report.WAREHOUSE_GROUP_CODE') +
        [item._id.warehouseCode, item._id.warehouseName].join('_'),
      data: item.items,
    };
  });
  const formatByKey: FormatByKey<ItemInventoryModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    storageCost: Alignment.CENTER,
    stockStart: Alignment.RIGHT,
    totalStockStart: Alignment.RIGHT,
    importIn: Alignment.RIGHT,
    totalImportIn: Alignment.RIGHT,
    exportIn: Alignment.RIGHT,
    totalExportIn: Alignment.RIGHT,
    stockEnd: Alignment.RIGHT,
    totalStockEnd: Alignment.RIGHT,
    note: Alignment.LEFT,
  };
  const model: ReportModel<ItemInventoryModel> = {
    childCompany: companyName,
    addressChildCompany: companyAddress,
    tableColumn: ITEM_INVENTORY_COLUMN,
    tableData: dataExcell,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseId ? warehouseName : null,
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
