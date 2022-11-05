import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportInventory } from '@layout/word/report-inventory.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { InventoryModel } from '@models/inventory.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportInventoryMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<InventoryModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.INVENTORY]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );

  return {
    nameFile: nameFile,
    result: await generateReportInventory(data.dataMapped, i18n),
  };
}
