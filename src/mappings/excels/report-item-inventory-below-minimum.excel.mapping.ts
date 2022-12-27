import { ReportType } from '@enums/report-type.enum';
import { footerItemBelowMinumum } from '@layout/excel/footer/footer-item-below-minimum.excel';
import { generateTable } from '@layout/excel/report-excel.layout';
import { ITEM_INVENTORY_BELOW_MINIMUM } from '@layout/excel/table-column-excel/report-inventory-below-minimum';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReportInventoryBelowMinimumModel } from '@models/item-inventory-below-minimum.model';
import {
  Alignment,
  FormatByKey,
  ReportModel,
  TableData,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryBelowMinimumExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ReportInventoryBelowMinimumModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<ReportInventoryBelowMinimumModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    stockQuantity: Alignment.RIGHT,
    minInventoryLimit: Alignment.RIGHT,
  };

  const model: ReportModel<ReportInventoryBelowMinimumModel> = {
    companyCode: data?.companyCode,
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: ITEM_INVENTORY_BELOW_MINIMUM,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_BELOW_MINIMUM]].key,
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
