import { generateReportAgeOfItemStock } from '@layout/word/report-age-of-items.word';
import { TableAgeOfItems } from '@models/age-of-items.model';
import { ReportRequest } from '@requests/report.request';
import { DATE_FOMAT_EXCELL, DATE_FOMAT_EXCELL_FILE } from '@utils/constant';
import * as moment from 'moment';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportAgeOfItemsMapping(
  request: ReportRequest,
  data: any[],
  i18n: I18nRequestScopeService,
) {
  let companyName = data[0]._id.companyName;
  let companyAddress = data[0]._id.companyAddress;
  let dateTo = request?.dateTo;
  let dateFrom = request?.dateFrom;
  let dataWord: TableAgeOfItems[] = data[0].warehouses.map((item: any) => {
    return {
      warehouseCode:
        i18n.translate('report.WAREHOUSE_GROUP_CODE') +
        [item.warehouseCode, item.warehouseName].join('_'),
      sixMonth: item.sixMonth,
      oneYearAgo: item.oneYearAgo,
      twoYearAgo: item.twoYearAgo,
      threeYearAgo: item.threeYearAgo,
      fourYearAgo: item.fourYearAgo,
      fiveYearAgo: item.fiveYearAgo,
      greaterfiveYear: item.greaterfiveYear,
      totalPrice: item.totalPrice,
      items: item.items,
    };
  });

  let title = '';
  let property = '';
  if (request.warehouseCode) {
    property = data[0]?.warehouses[0].warehouseName.toUpperCase();
  } else {
    property = i18n.translate(`report.REPORT_ALL`);
  }
  title = i18n.translate(`report.AGE_OF_ITEM_STOCK.TITLE`, {
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
    nameFile = i18n.translate(`report.AGE_OF_ITEM_STOCK.SHEET_NAME`, {
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
    nameFile = i18n.translate(`report.AGE_OF_ITEM_STOCK.SHEET_NAME`, {
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
    result: await generateReportAgeOfItemStock(
      dataWord,
      companyName,
      companyAddress,
      title,
      reportTime,
      i18n,
    ),
  };
}
