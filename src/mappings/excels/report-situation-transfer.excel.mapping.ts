import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { SITUATION_TRANSFER_COLUMN } from '@layout/excel/table-column-excel/report-situation-transfer-column';
import { reportSituationTransferTemplateData } from '@layout/excel/table-data-excel/report-situation-transfer.template-data';
import { ReportModel } from '@models/report.model';
import { TableDataSituationTransfer } from '@models/situation-transfer.model';

import { ReportRequest } from '@requests/report.request';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';
export async function reportSituationTransferExcelMapping(
  request: ReportRequest,
  data: any[],
  i18n: I18nRequestScopeService,
) {
  let companyName = data[0]?._id?.companyName || '';
  let companyAddress = data[0]?._id?.companyAddress || '';
  let dataExcell: TableDataSituationTransfer[] = [];
  if (data[0]?.warehouses) {
    dataExcell = data[0].warehouses.map((item) => {
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item.warehouseCode, item.warehouseName].join('_'),
        totalPrice: item.totalPrice,
        orders: item.orders,
      };
    });
  }

  const model: ReportModel<any> = {
    childCompany: companyName,
    addressChildCompany: companyAddress,
    tableColumn: SITUATION_TRANSFER_COLUMN,
    tableData: dataExcell,
    header: true,
    key: REPORT_INFO[ReportType[ReportType.SITUATION_TRANSFER]]?.key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request?.warehouseId ? data[0]?.warehouseName : null,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportSituationTransferTemplateData,
    i18n,
  );

  return {
    nameFile,
    dataBase64,
  };
}
