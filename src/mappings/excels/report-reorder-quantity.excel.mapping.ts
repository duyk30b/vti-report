import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { REORDER_QUANTITY_COLUMN } from '@layout/excel/table-column-excel/report-reorder-quantity-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ReOderQuantityModel } from '@models/reorder-quantity.model';
import { FormatByKey, Alignment, ReportModel } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportReorderQuantityExcelMapping(
  request: ReportRequest,
  data: ReportInfo<any>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<ReOderQuantityModel> = {
    company: Alignment.LEFT,
    warehouse: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.LEFT,
    reorderQuantity: Alignment.LEFT,
  };

  const model: ReportModel<any> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: REORDER_QUANTITY_COLUMN,
    tableData: data.dataMapped,
    header: true,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.REORDER_QUANTITY]].key,
    dateFrom: request.dateFrom,
    dateTo: request?.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
    reportType: request?.reportType || 0,
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
