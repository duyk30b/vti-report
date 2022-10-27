import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { INVENTORY_COLUMN } from '@layout/excel/table-column-excel/report-inventory';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { InventoryModel } from '@models/inventory.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { REPORT_INFO } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportInventoryExcelMapping(
  request: ReportRequest,
  data: DailyLotLocatorStock[],
  i18n: I18nRequestScopeService,
) {
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    if (cur.warehouseCode && cur.warehouseName) {
      const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
      if (!prev[warehouseCode]) {
        prev[warehouseCode] = [];
      }
      const data: InventoryModel = {
        index: 0,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        lotNumber: cur.lotNumber,
        stockQuantity: cur.stockQuantity,
        positision: cur.locatorCode,
        unitPrice: cur.storageCost,
        totalPrice: cur.storageCost * cur.stockQuantity,
      };
      prev[warehouseCode].push(data);
      return prev;
    }
  }, {});
  const dataExcell: TableData<InventoryModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  const formatByKey: FormatByKey<InventoryModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    stockQuantity: Alignment.RIGHT,
    positision: Alignment.LEFT,
    unitPrice: Alignment.RIGHT,
    totalPrice: Alignment.RIGHT,
  };

  const model: ReportModel<InventoryModel> = {
    childCompany: data[0]?.companyName,
    addressChildCompany: data[0]?.companyAddress,
    tableColumn: INVENTORY_COLUMN,
    tableData: dataExcell,
    header: false,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.INVENTORY]].key,
    dateFrom: request.dateFrom,
    dateTo: request?.dateTo,
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
