import { ReportType } from '@enums/report-type.enum';
import { footerItemInventory } from '@layout/excel/footer/footer-item-inventory.excel';
import { generateTable } from '@layout/excel/report-excel.layout';
import { ITEM_INVENTORY_COLUMN } from '@layout/excel/table-column-excel/report-item-inventory';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
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
  data: ReportInfo<ItemInventoryModel>,
) {
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

  const model: ReportModel<any> = {
    companyCode: data.companyCode,
    childCompany: data?.companyName?.toUpperCase(),
    addressChildCompany: data?.companyAddress?.toUpperCase(),
    tableColumn: ITEM_INVENTORY_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data?.warehouseName : null,
    footer: footerItemInventory,
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
