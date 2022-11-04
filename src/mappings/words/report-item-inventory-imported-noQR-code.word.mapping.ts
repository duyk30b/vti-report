import { generateReportItemInventoryImportedNoQRCode } from '@layout/word/item-inventory-imported-no-qr-code-column.word';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { DATE_FOMAT_EXCELL_FILE } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryImportedNoQRCodeWordMapping(
  request: ReportRequest,
  data: ReportOrderItemLot[],
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const dateFrom = request.dateFrom;
  const dateTo = request.dateTo;

  let nameFile = '';
  if (dateFrom && dateTo) {
    const dateFromFormatedForFile = moment(dateFrom).format(
      DATE_FOMAT_EXCELL_FILE,
    );
    const dateToFormatedForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    nameFile = i18n.translate(
      `report.ITEM_INVENTORY_IMPORTED_NO_QR_CODE.SHEET_NAME`,
      {
        args: {
          property: dateFromFormatedForFile + '_' + dateToFormatedForFile,
        },
      },
    );
  } else {
    const dateForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    nameFile = i18n.translate(
      `report.ITEM_INVENTORY_IMPORTED_NO_QR_CODE.SHEET_NAME`,
      {
        args: { property: dateForFile },
      },
    );
  }

  let index = 1;
  const groupWarehouse = data.reduce((pre, curr) => {
    if (!pre[curr?.warehouseCode]) index = 1;
    else index++;
    pre[curr?.warehouseCode] = pre[curr?.warehouseCode] || [];
    pre[curr?.warehouseCode].push({ ...curr, index });
    return pre;
  }, {});

  const dataWord = [];
  for (const warehouseCode in groupWarehouse) {
    dataWord.push({
      warehouseCode: warehouseCode,
      warehouseName: groupWarehouse[warehouseCode][0]?.warehouseName,
      items: groupWarehouse[warehouseCode],
    });
  }

  return {
    nameFile: nameFile,
    result: await generateReportItemInventoryImportedNoQRCode(dataWord, i18n),
  };
}
