import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import { isEmpty } from 'lodash';
import {
  TYPE_TRANSACTION,
  TYPE_TRANSACTION_TRANFER_IMPORT,
  WAREHOUSE_TARGET,
  formatMoney,
} from '@constant/common';
import { TransactionDetailModel } from '@models/transaction-detail.model';
import { TableData } from '@models/report.model';
import * as moment from 'moment';
import { DATE_FOMAT_EXCELL } from '@utils/constant';

export async function getTransactionDetail(
  data: any[],
  i18n: I18nRequestScopeService,
  dataWarehouseTargetCode: any,
  reportType: number,
): Promise<ReportInfo<any>> {
  const dataMaping: ReportInfo<any> = {
    companyCode: data[0]?.companyCode ?? '',
    companyName: data[0]?.name?.toUpperCase() || '',
    companyAddress: data[0]?.address ?? '',
    warehouseName: '',
    dataMapped: null,
  };

  const groupByWarehouseCode = {};
  data?.map((item) => {
    dataMaping.warehouseName = item?.warehouseName || '';
    formatData(item, WAREHOUSE_TARGET.NO, groupByWarehouseCode);
  });
  dataWarehouseTargetCode?.map((item) => {
    dataMaping.warehouseName = isEmpty(data)
      ? item?.warehouseTargetName || ''
      : '';
    formatData(item, WAREHOUSE_TARGET.YES, groupByWarehouseCode);
  });

  const dataExcell: TableData<TransactionDetailModel>[] = [];
  for (const key in groupByWarehouseCode) {
    dataExcell.push({
      warehouseCode: i18n.translate('report.WAREHOUSE_GROUP_CODE') + key,
      data: sortData(groupByWarehouseCode[key]),
      reportType: reportType || 0,
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}

function formatData(item: any, type: number, groupByWarehouseCode: any) {
  let warehouseCode = `${item?.warehouseCode} - ${item?.warehouseName}`;
  let warehouseName = `${item?.warehouseName}`;
  let typeTransaction = TYPE_TRANSACTION[item?.orderType];
  const check = isEmpty(item?.transactionNumberCreated);
  let ebsNumber = check
    ? `${item?.ebsNumber || ''}`
    : `${item?.transactionNumberCreated}\n${item?.ebsNumber || ''}`;
  const source = item?.source
    ? `${item?.source?.code} - ${item?.source?.name}`
    : '';
  if (type) {
    warehouseCode = `${item?.warehouseTargetCode} - ${item?.warehouseTargetName}`;
    warehouseName = `${item?.warehouseTargetName}`;
    ebsNumber = '';
    typeTransaction = TYPE_TRANSACTION_TRANFER_IMPORT;
  }
  if (!groupByWarehouseCode[warehouseCode])
    groupByWarehouseCode[warehouseCode] = [];
  const data: any = {
    warehouseName: warehouseName,
    itemCode: item?.itemCode,
    itemName: item?.itemName,
    unit: item?.unit,
    quantity: formatMoney(item?.planQuantity, 2),
    storageCost: formatMoney(item?.storageCost, 2),
    amount: formatMoney(item?.amount),
    manufacturingCountry: item?.manufacturingCountry,
    orderCode: item?.orderCode,
    ebsNumber: ebsNumber,
    typeTransaction: typeTransaction,
    orderCreatedAt: moment(item?.orderCreatedAt).format(DATE_FOMAT_EXCELL),
    reason: item?.reason,
    source: source,
    contractNumber: item?.contract,
    vendor: item?.providerName,
    construction: item?.constructionCode,
    explain: item?.explain,
  };
  groupByWarehouseCode[warehouseCode].push(data);
}

function sortData(arr: TransactionDetailModel[]) {
  arr.sort(function (a, b) {
    const itemCodeA = a?.itemCode,
      dateA = a?.orderCreatedAt;
    const itemCodeB = b?.itemCode,
      dateB = b?.orderCreatedAt;
    if (itemCodeA < itemCodeB) return -1;
    if (itemCodeA > itemCodeB) return 1;
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });
  return arr;
}
