import { ReportType } from '@enums/report-type.enum';
import { footerOrderImportIncompleted } from '@layout/excel/footer/footer-order-import-incompleted';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REPORT_ITEM_IMPORT_BUT_NOT_PUT_TO_POSITION_COLUMN } from '@layout/excel/table-column-excel/report-Item-imported-but-not-put-to-position-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ItemImportedButNotStoreToPositionModel } from '@models/Item-imported-but-not-put-to-position.model';
import { FormatByKey, Alignment, ReportModel } from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemImportedButNotPutToPositionExcelMapping(
  request: ReportRequest,
  data: any,
  i18n: I18nRequestScopeService,
) {
  const dataExcell = data.map((item) => {
    return {
      warehouseCode:
        i18n.translate('report.WAREHOUSE_GROUP_CODE') +
        [item._id.warehouseCode, item._id.warehouseName].join('_'),
      data: item.items,
    };
  });

  const formatByKey: FormatByKey<ItemImportedButNotStoreToPositionModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    ebsId: Alignment.LEFT,
    reason: Alignment.LEFT,
    explain: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    planQuantity: Alignment.RIGHT,
    actualQuantity: Alignment.RIGHT,
    remainQuantity: Alignment.RIGHT,
    note: Alignment.LEFT,
    receiver: Alignment.RIGHT,
  };

  const model: ReportModel<ItemImportedButNotStoreToPositionModel> = {
    childCompany: data[0]?.company?.companyName || '',
    addressChildCompany: data[0]?.company?.companyAddress || '',
    tableColumn: REPORT_ITEM_IMPORT_BUT_NOT_PUT_TO_POSITION_COLUMN,
    tableData: dataExcell,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[
      ReportType[ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION]
    ].key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseId ? data[0].warehouseName : null,
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
