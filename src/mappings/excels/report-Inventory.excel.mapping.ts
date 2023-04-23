import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { INVENTORY_COLUMN } from '@layout/excel/table-column-excel/report-inventory';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { InventoryModel } from '@models/inventory.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportInventoryExcelMapping(
  request: ReportRequest,
  data: ReportInfo<any>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<InventoryModel> = {
    index: Alignment.CENTER,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    manufacturingCountry: Alignment.CENTER,
    locatorCode: Alignment.LEFT,
    stockQuantity: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    storageCost: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
    totalPrice: { alignment: Alignment.RIGHT, numFmt: '### ### ### ###' },
  };

  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: INVENTORY_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.INVENTORY]].key,
    dateFrom: request.dateFrom,
    dateTo: request?.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
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
