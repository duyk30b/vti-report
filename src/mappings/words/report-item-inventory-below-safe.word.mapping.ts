import { generatereportItemInventoryBelowSafe } from '@layout/word/report-inventory-below-safe.word';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { DailyWarehouseItemStock } from '@schemas/daily-warehouse-item-stock.schema';
import { DATE_FOMAT_EXCELL, DATE_FOMAT_EXCELL_FILE } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryBelowSafeWordMapping(
  request: ReportRequest,
  data: DailyWarehouseItemStock[],
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  const companyName = data[0].companyName;
  const companyAddress = data[0].companyAddress;
  const warehouse = request.warehouseId ? data[0].warehouseName : null;
  const dateFrom = request.dateFrom;
  const dateTo = request.dateTo;

  let title = '';
  let property = '';
  if (warehouse) {
    property = warehouse.toUpperCase();
  } else {
    property = i18n.translate(`report.REPORT_ALL`);
  }
  title = i18n.translate(`report.ITEM_INVENTORY_BELOW_SAFE.TITLE`, {
    args: { property: property },
  });

  let nameFile = '';
  let reportTime = '';
  if (dateTo && dateFrom) {
    const dateFromFormatedForFile = moment(dateFrom).format(
      DATE_FOMAT_EXCELL_FILE,
    );
    const dateToFormatedForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    const dateFromFormated = moment(dateFrom).format(DATE_FOMAT_EXCELL);
    const dateToFormated = moment(dateTo).format(DATE_FOMAT_EXCELL);
    nameFile = i18n.translate(`report.ITEM_INVENTORY_BELOW_SAFE.SHEET_NAME`, {
      args: {
        property: dateFromFormatedForFile + '_' + dateToFormatedForFile,
      },
    });

    reportTime = i18n.translate(`report.DATE_TEMPLATE_TO_FROM`, {
      args: {
        from: dateFromFormated,
        to: dateToFormated,
      },
    });
  } else {
    const dateForFile = moment(dateTo).format(DATE_FOMAT_EXCELL_FILE);
    const date = moment(dateTo).format(DATE_FOMAT_EXCELL);
    nameFile = i18n.translate(`report.ITEM_INVENTORY_BELOW_SAFE.SHEET_NAME`, {
      args: { property: dateForFile },
    });
    reportTime = i18n.translate(`report.DATE_TEMPLATE_TO`, {
      args: {
        to: date,
      },
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
    result: await generatereportItemInventoryBelowSafe(
      dataWord,
      companyName,
      companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
