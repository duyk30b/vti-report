import { ReportType } from '@enums/report-type.enum';
import { footerItemBelowMinumum } from '@layout/excel/footer/footer-item-below-minimum.excel';
import { generateTable } from '@layout/excel/report-excel.layout';
import { ITEM_INVENTORY_BELOW_MINIMUM } from '@layout/excel/table-column-excel/report-inventory-below-minimum';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInventoryBelowMinimumModel } from '@models/item-inventory-below-minimum.model';
import {
  Alignment,
  FormatByKey,
  ReportModel,
  TableData,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryBelowMinimumExcelMapping(
  request: ReportRequest,
  data: DailyWarehouseItemStock[],
  i18n: I18nRequestScopeService,
) {
  const groupByWarehouseCode = data.reduce((prev, cur) => {
    if (cur.warehouseCode && cur.warehouseName) {
      const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
      if (!prev[warehouseCode]) {
        prev[warehouseCode] = [];
      }
      prev[warehouseCode].push({
        index: 0,
        itemCode: cur.itemCode,
        itemName: cur.itemName,
        unit: cur.unit,
        stockQuantity: cur.stockQuantity,
        minInventoryLimit: cur.minInventoryLimit,
      });
      return prev;
    }
  }, {});
  const dataExcell: TableData<ReportInventoryBelowMinimumModel>[] = [];

  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: groupByWarehouseCode[key],
    });
  }

  const formatByKey: FormatByKey<ReportInventoryBelowMinimumModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    stockQuantity: Alignment.RIGHT,
    minInventoryLimit: Alignment.RIGHT,
  };

  const model: ReportModel<ReportInventoryBelowMinimumModel> = {
    childCompany: data[0]?.companyName,
    addressChildCompany: data[0]?.companyAddress,
    tableColumn: ITEM_INVENTORY_BELOW_MINIMUM,
    tableData: dataExcell,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_BELOW_MINIMUM]].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data[0].warehouseName : null,
    footer: footerItemBelowMinumum,
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
