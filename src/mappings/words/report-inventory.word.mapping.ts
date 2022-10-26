import { generateReportInventory } from '@layout/word/report-inventory.word';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import { DATE_FOMAT_EXCELL, DATE_FOMAT_EXCELL_FILE } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportInventoryMapping(
  request: ReportRequest,
  data: DailyLotLocatorStock[],
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const dateFrom = request.dateFrom;
  const dateTo = request.dateTo;

  let nameFile = '';
  if (dateTo && dateFrom) {
    const dateFromFormatedForFile = moment(dateFrom).format(
      DATE_FOMAT_EXCELL_FILE,
    );
    const dateToFormatedForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    nameFile = i18n.translate(`report.INVENTORY.SHEET_NAME`, {
      args: {
        property: dateFromFormatedForFile + '_' + dateToFormatedForFile,
      },
    });
  } else {
    const dateForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    const date = moment(dateTo).format(DATE_FOMAT_EXCELL);
    nameFile = i18n.translate(`report.INVENTORY.SHEET_NAME`, {
      args: { property: dateForFile },
    });
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
      warehouseId: groupWarehouse[warehouseCode][0]?.warehouseId,
      items: groupWarehouse[warehouseCode],
    });
  }
  return {
    nameFile: nameFile,
    result: await generateReportInventory(dataWord, i18n),
  };
}
