import { generateReportSituationInventoryPeriod } from '@layout/word/report-situation-inventory-period.word';
import { TableDataSituationInventoryPeriod } from '@models/statistic-inventory.model';
import { ReportRequest } from '@requests/report.request';
import { ExportResponse } from '@responses/export.response';
import { DATE_FOMAT_EXCELL, DATE_FOMAT_EXCELL_FILE } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportSituationInventoryPeriodMapping(
  request: ReportRequest,
  data: any[],
  i18n: I18nRequestScopeService,
): Promise<ExportResponse> {
  let companyName = '';
  let companyAddress = '';

  let warehouseName = '';
  let dateTo = request?.dateTo;
  let dateFrom = request?.dateFrom;
  let dataWord: TableDataSituationInventoryPeriod[] = data.map((item: any) => {
    companyName = item._id.companyName;
    companyAddress = item._id.companyAddress;
    warehouseName = item._id.warehouseName;
    return {
      warehouseCode:
        i18n.translate('report.WAREHOUSE_GROUP_CODE') +
        [item._id.warehouseCode, item._id.warehouseName].join('_'),
      totalPlanQuantity: item.totalPlanQuantity,
      totalActualQuantity: item.totalActualQuantity,
      items: item.items,
    };
  });

  let title = '';
  let property = '';
  if (request.warehouseId) {
    property = warehouseName.toUpperCase();
  } else {
    property = i18n.translate(`report.REPORT_ALL`);
  }
  title = i18n.translate(`report.SITUATION_INVENTORY_PERIOD.TITLE`, {
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
    nameFile = i18n.translate(`report.SITUATION_INVENTORY_PERIOD.SHEET_NAME`, {
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
    nameFile = i18n.translate(`report.SITUATION_INVENTORY_PERIOD.SHEET_NAME`, {
      args: { property: dateForFile },
    });
    reportTime = i18n.translate(`report.DATE_TEMPLATE_TO`, {
      args: {
        to: date,
      },
    });
  }

  return {
    nameFile: nameFile,
    result: await generateReportSituationInventoryPeriod(
      dataWord,
      companyName,
      companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
