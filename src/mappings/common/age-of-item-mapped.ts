import { TableAgeOfItems, Items } from '@models/age-of-items.model';
import { minus, mul, plus } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import { compact, keyBy, isEmpty, uniq } from 'lodash';
import { WarehouseServiceInterface } from '@components/warehouse/interface/warehouse.service.interface';

export async function getSituationTransferMapped(
  data: any[],
  i18n: I18nRequestScopeService,
  warehouseService?: WarehouseServiceInterface,
  transactionNow?: any,
): Promise<ReportInfo<TableAgeOfItems[]>> {
  const dataMaping: ReportInfo<TableAgeOfItems[]> = {
    companyCode: data[0]?._id?.companyCode || '',
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: '',
    dataMapped: null,
  };

  const companyCode = data[0]?._id?.companyCode || '';
  let arrWarehouseCode = [];
  let dataExcell: TableAgeOfItems[] = [];
  if (data.length > 0) {
    dataExcell = data[0]?.warehouses?.map((item: any) => {
      arrWarehouseCode.push(item.warehouseCode);
      dataMaping.warehouseName = item.warehouseName;
      let check = 0;
      item.items?.map((i) => {
        i?.groupByStorageDate.map((infoStock) => {
          if (transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}-${companyCode}`]) {
            let transaction = transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}-${companyCode}`];
            let info = infoStock;
            if (transaction?.quantityImported) {
              i.totalQuantity = plus(i.totalQuantity, transaction?.quantityImported);
              i?.groupByStorageDate.push({
                storageDate: transaction?.transactionDate,
                lotNumber: infoStock?.lotNumber,
                locatorCode: infoStock?.locatorCode,
                unit: infoStock?.unit,
                stockQuantity: transaction?.quantityImported,
                storageCost: infoStock?.storageCost,
                totalPrice: infoStock?.storageCost,
                sixMonthAgo: infoStock?.sixMonthAgo,
                oneYearAgo: infoStock?.oneYearAgo,
                twoYearAgo: infoStock?.twoYearAgo,
                threeYearAgo: infoStock?.threeYearAgo,
                fourYearAgo: infoStock?.fourYearAgo,
                fiveYearAgo: infoStock?.fiveYearAgo,
                greaterfiveYear: infoStock?.greaterfiveYear,
              })
              transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}-${companyCode}`].quantityImported = 0;
            }
            if (transaction?.quantityExported) {
              i.totalQuantity = minus(i.totalQuantity, transaction?.quantityExported);
              const numberCheck = minus(infoStock.stockQuantity, transaction?.quantityExported);
              if (numberCheck >= 0) {
                transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}-${companyCode}`].quantityExported = 0;
                infoStock.stockQuantity = numberCheck;
              } else {
                const quantity = minus(transaction?.quantityExported, infoStock.stockQuantity);
                transaction.quantityExported = quantity;
                infoStock.stockQuantity = 0;
              }
            }
          }
        })
        check = plus(check, i?.totalQuantity) || check;
      })
      if (!check) return null;

      const { arrformated, objectTransaction } = pushItemOld(transactionNow, item.items, item.warehouseCode);
      if (!isEmpty(arrformated)) {
        item.items = arrformated;
        transactionNow = objectTransaction;
      }
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
  }
  dataExcell = compact(dataExcell);

  let dataExcell2: TableAgeOfItems[] = [];
  if (!isEmpty(transactionNow)) {
    let warehouseCodeTransaction = [];
    for (const key in transactionNow) {
      if (transactionNow[key]) {
        const code = transactionNow[key]?.warehouseCode || '';
        warehouseCodeTransaction.push(code);
      }
    }
    warehouseCodeTransaction = uniq(warehouseCodeTransaction);
    const listWarehouses = await warehouseService.getWarehouseByCodes(warehouseCodeTransaction);
    const listWarehousesMap = keyBy(listWarehouses, 'code');
    arrWarehouseCode = uniq(arrWarehouseCode);
    warehouseCodeTransaction.map((warehouseCode) => {
      if (!arrWarehouseCode.includes(warehouseCode)) {
        const { arrformated, objectTransaction } = pushItemOld(transactionNow, [], warehouseCode);
        transactionNow = objectTransaction;
        if (!isEmpty(arrformated)) {
          const arr = {
            warehouseCode:
              i18n.translate('report.WAREHOUSE_GROUP_CODE') +
              [warehouseCode, listWarehousesMap[warehouseCode]?.name].join('_'),
            sixMonth: 0,
            oneYearAgo: 0,
            twoYearAgo: 0,
            threeYearAgo: 0,
            fourYearAgo: 0,
            fiveYearAgo: 0,
            greaterfiveYear: 0,
            totalPrice: 0,
            items: arrformated,
          };
          dataExcell.push(arr);
        }
      }
    })

  }
  dataMaping.dataMapped = isEmpty(dataExcell) ? dataExcell2 : dataExcell;
  dataMaping.dataMapped = dataMaping.dataMapped || [];
  return dataMaping;
}

function pushItemOld(objectTransaction: any, arrItem: any[], warehouseCode?: string) {
  let keyByArrItem = keyBy(arrItem, 'itemCode');
  const arrformated: any[] = [];
  for (const key in objectTransaction) {
    const item = objectTransaction[key];
    if (item && keyByArrItem[item?.itemCode] && item.warehouseCode == warehouseCode && item.checkImport > 0) {
      objectTransaction[key] = null;
      const quantity = minus(item?.quantityImported, item?.quantityExported);
      const stockQuantityOld = keyByArrItem[item?.itemCode]?.totalQuantity;
      keyByArrItem[item?.itemCode].totalQuantity = plus(stockQuantityOld, quantity) || stockQuantityOld;
      keyByArrItem[item.itemCode]?.groupByStorageDate?.push(formatGroupByStorageDate(item, quantity));
    } else if (item && item.warehouseCode == warehouseCode && item.checkImport > 0) {
      objectTransaction[key] = null;
      const quantity = minus(item?.quantityImported, item?.quantityExported)
      const stockQuantity = Math.abs(quantity);
      keyByArrItem[item?.itemCode] = formatItem(item, stockQuantity);
    }
  }
  Object.keys(objectTransaction).forEach(key => {
    const itemCodeKey = objectTransaction[key]?.itemCode;
    if (!isEmpty(objectTransaction[key]) && !isEmpty(keyByArrItem[itemCodeKey]) && objectTransaction[key]?.warehouseCode == warehouseCode) {
      let quantityExport = objectTransaction[key]?.checkImport || 0;
      let totalQuantity = keyByArrItem[itemCodeKey]?.totalQuantity || 0;
      keyByArrItem[itemCodeKey]?.groupByStorageDate.map((itemInfo) => {
        if (quantityExport != 0) {
          itemInfo.stockQuantity = plus(itemInfo.stockQuantity, quantityExport);
          keyByArrItem[itemCodeKey].totalQuantity = plus(totalQuantity, quantityExport);
          if (itemInfo.stockQuantity > 0) {
            quantityExport = 0;
          } else {
            quantityExport = itemInfo.stockQuantity
            itemInfo = null;
          }
        }
      })
      if (keyByArrItem[itemCodeKey].totalQuantity <= 0) {
        keyByArrItem[itemCodeKey] = null;
      } else {
        const groupItem = keyByArrItem[itemCodeKey]?.groupByStorageDate || [];
        keyByArrItem[itemCodeKey].groupByStorageDate = compact(groupItem);
      }
    }
  })
  for (const key in keyByArrItem) {
    if (!isEmpty(keyByArrItem[key])) arrformated.push(keyByArrItem[key]);
  }
  return {
    arrformated: arrformated as Array<Items>,
    objectTransaction: objectTransaction,
  };
}

function formatItem(item: any, quantity?: number) {
  return {
    itemCode: item.itemCode,
    itemName: item.itemName,
    totalQuantity: quantity || 0,
    totalPrice: item?.storageCost || 0,
    sixMonthAgo: item?.sixMonthAgo || 0,
    oneYearAgo: item?.oneYearAgo || 0,
    twoYearAgo: item?.twoYearAgo || 0,
    threeYearAgo: item?.threeYearAgo || 0,
    fourYearAgo: item?.fourYearAgo || 0,
    fiveYearAgo: item?.fiveYearAgo || 0,
    greaterfiveYear: item?.greaterfiveYear || 0,
    groupByStorageDate: [
      {
        origin: item?.origin || '',
        account: item?.account || '',
        storageDate: item.transactionDate,
        lotNumber: item.lotNumber,
        locatorCode: item.locatorCode,
        unit: item.unit,
        stockQuantity: quantity || 0,
        storageCost: item?.storageCost || 0,
        totalPrice: item?.totalPrice || 0,
        sixMonthAgo: item.sixMonthAgo || 0,
        oneYearAgo: item?.oneYearAgo || 0,
        twoYearAgo: item?.twoYearAgo || 0,
        threeYearAgo: item?.threeYearAgo || 0,
        fourYearAgo: item?.fourYearAgo || 0,
        fiveYearAgo: item?.fiveYearAgo || 0,
        greaterfiveYear: item?.greaterfiveYear || 0,
      }
    ]
  }
}

function formatGroupByStorageDate(item: any, quantity?: number) {
  return {
    storageDate: item.transactionDate,
    origin: item?.origin || null,
    account: item?.account || null,
    lotNumber: item.lotNumber,
    locatorCode: item.locatorCode,
    unit: item.unit,
    stockQuantity: quantity || 0,
    storageCost: item.storageCost || 0,
    totalPrice: mul(item.storageCost, item.quantityImported),
    sixMonthAgo: item.sixMonthAgo || 0,
    oneYearAgo: item.oneYearAgo || 0,
    twoYearAgo: item.twoYearAgo || 0,
    threeYearAgo: item.threeYearAgo || 0,
    fourYearAgo: item.fourYearAgo || 0,
    fiveYearAgo: item.fiveYearAgo || 0,
    greaterfiveYear: item.greaterfiveYear || 0,
  }
}