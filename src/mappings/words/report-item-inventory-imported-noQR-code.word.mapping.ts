import { ReportType } from '@enums/report-type.enum';
import { getReportInfo } from '@layout/excel/report-excel.layout';
import { generateReportItemInventoryImportedNoQRCode } from '@layout/word/item-inventory-imported-no-qr-code-column.word';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ItemInventoryImportedNoQRCodeModel } from '@models/Item-inventory-imported-no-qr-code.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryImportedNoQRCodeWordMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ItemInventoryImportedNoQRCodeModel>[]>,
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const { nameFile } = getReportInfo(
    i18n,
    REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_IMPORTED_NO_QR_CODE]].key,
    request.warehouseCode ? data?.warehouseName : null,
    request.dateFrom,
    request.dateTo,
  );
  return {
    nameFile: nameFile,
    result: await generateReportItemInventoryImportedNoQRCode(
      data.dataMapped,
      i18n,
    ),
  };
}
