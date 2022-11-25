import { ReportType } from '@enums/report-type.enum';
import { footerItemBelowMinumum } from '@layout/excel/footer/footer-item-below-minimum.excel';
import { generateTable } from '@layout/excel/report-excel.layout';
import { INVENTORY_BELOW_SAFE } from '@layout/excel/table-column-excel/report-inventory-below-safe';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportInventoryBelowSafeModel } from '@models/item-inventory-below-safe.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryBelowSafeExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportInventoryBelowSafeModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<ReportInventoryBelowSafeModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    inventoryLimit: Alignment.RIGHT,
    stockQuantity: Alignment.RIGHT,
  };

  const model: ReportModel<ReportInventoryBelowSafeModel> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: INVENTORY_BELOW_SAFE,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_BELOW_SAFE]].key,
    dateFrom: request.dateFrom,
    warehouse: request.warehouseCode ? data?.warehouseName : null,
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
