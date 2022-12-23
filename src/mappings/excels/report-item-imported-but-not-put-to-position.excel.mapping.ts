import { ReportType } from '@enums/report-type.enum';
import { footerOrderImportIncompleted } from '@layout/excel/footer/footer-order-import-incompleted';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ITEM_IMPORT_BUT_NOT_PUT_TO_POSITION_COLUMN } from '@layout/excel/table-column-excel/report-Item-imported-but-not-put-to-position-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ItemImportedButNotStoreToPositionModel } from '@models/Item-imported-but-not-put-to-position.model';
import {
  FormatByKey,
  Alignment,
  ReportModel,
  TableData,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemImportedButNotPutToPositionExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ItemImportedButNotStoreToPositionModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<ItemImportedButNotStoreToPositionModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    ebsNumber: Alignment.LEFT,
    reason: Alignment.LEFT,
    explain: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    recievedQuantity: Alignment.RIGHT,
    actualQuantity: Alignment.RIGHT,
    remainQuantity: Alignment.RIGHT,
    note: Alignment.LEFT,
    performerName: Alignment.LEFT,
  };

  const model: ReportModel<any> = {
    companyCode: data.companyCode,
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: REPORT_ITEM_IMPORT_BUT_NOT_PUT_TO_POSITION_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[
      ReportType[ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION]
    ].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    footer: footerOrderImportIncompleted,
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
