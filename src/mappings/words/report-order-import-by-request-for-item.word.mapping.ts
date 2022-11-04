import { generateReportOrderImportByRequestForItem } from '@layout/word/report-order-import-by-request-for-item.word';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { ReportOrderItem } from '@schemas/report-order-item.schema';
import { DATE_FOMAT_EXCELL, DATE_FOMAT_EXCELL_FILE } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportOrderImportByRequestForItemWordMapping(
  request: ReportRequest,
  data: ReportOrderItem[],
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
    const dateFromFormated = moment(dateFrom).format(DATE_FOMAT_EXCELL);
    const dateToFormated = moment(dateTo).format(DATE_FOMAT_EXCELL);
    nameFile = i18n.translate(
      `report.ORDER_IMPORT_BY_REQUEST_FOR_ITEM.SHEET_NAME`,
      {
        args: {
          property: dateFromFormatedForFile + '_' + dateToFormatedForFile,
        },
      },
    );
  } else {
    const dateForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    const date = moment(dateTo).format(DATE_FOMAT_EXCELL);
    nameFile = i18n.translate(
      `report.ORDER_IMPORT_BY_REQUEST_FOR_ITEM.SHEET_NAME`,
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
      warehouseName: groupWarehouse[0]?.warehouseName,
      items: groupWarehouse[warehouseCode],
    });
  }

  return {
    nameFile: nameFile,
    result: await generateReportOrderImportByRequestForItem(dataWord, i18n),
  };
}
