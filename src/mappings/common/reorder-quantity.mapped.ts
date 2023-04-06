import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { formatMoney } from '@constant/common';
import { ReOderQuantityModel } from '@models/reorder-quantity.model';
import { TableData } from '@models/report.model';
import { ReportRequest } from '@requests/report.request';
import { DailyLotLocatorStock } from '@schemas/daily-lot-locator-stock.schema';
import {
  divBigNumber,
  minusBigNumber,
  mulBigNumber,
  plusBigNumber,
} from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';

export async function getReOrderQuantity(
  data: DailyLotLocatorStock[],
  i18n: I18nRequestScopeService,
  dataItemPlanning: any,
  dataReceipt: any,
  dataInventory: any,
  request: ReportRequest,
  userService?: UserServiceInterface,
): Promise<ReportInfo<TableData<ReOderQuantityModel>[]>> {
  const dataMaping: ReportInfo<any> = {
    companyCode: data[0]?.companyCode,
    companyName: data[0]?.companyName?.toUpperCase(),
    companyAddress: data[0]?.companyAddress,
    warehouseName: data[0]?.warehouseName,
    dataMapped: null,
  };
  let companyName = '';
  if (data[0]?.companyCode) {
    const company = await userService.getCompanies({
      code: request.companyCode,
    });
    const dataCompany = company?.data?.pop();
    companyName = dataCompany?.name || '';
  }

  const dataGroup = data.reduce((prev, cur) => {
    const keyItemPlanning = `${cur.companyCode}-${cur.warehouseCode}-${cur.itemCode}`;
    const keyReceipt = `${cur.companyCode}-${cur.itemCode}`;
    const warehouseCode = cur.warehouseCode + ' - ' + cur.warehouseName;
    if (!prev[warehouseCode]) {
      prev[warehouseCode] = [];
    }

    const availableBalance = minusBigNumber(
      cur?.stockQuantity || 0,
      dataItemPlanning[keyItemPlanning]?.planQuantity || 0,
    );
    const reorderQuantity = getNumberReOrderQuantity(
      dataInventory[keyItemPlanning]?.reorderPoint || 0,
      dataReceipt[keyReceipt]?.orderQuantity || 0,
      availableBalance,
      dataInventory[keyItemPlanning]?.eoq || 0,
    );
    const returnData: ReOderQuantityModel = {
      company: companyName,
      warehouse: cur.warehouseName,
      itemCode: cur.itemCode,
      itemName: cur.itemName,
      unit: cur.unit,
      reorderQuantity: formatMoney(reorderQuantity, 2),
    };
    prev[warehouseCode].push(returnData);

    return prev;
  }, {});

  const dataExcell: TableData<ReOderQuantityModel>[] = [];
  for (const key in dataGroup) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: dataGroup[key],
      reportType: request?.reportType || 0,
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}

function getNumberReOrderQuantity(
  ROP: number,
  QOO: number,
  AB: number,
  EOQ: number,
) {
  const tmp = minusBigNumber(plusBigNumber(ROP || 0, 1), QOO);
  const minusTmp = minusBigNumber(tmp, AB || 0);
  const numTmp = plusBigNumber(divBigNumber(minusTmp, EOQ) || 0, 1);
  const reorderQuantity = mulBigNumber(numTmp, EOQ || 0);
  return reorderQuantity;
}
