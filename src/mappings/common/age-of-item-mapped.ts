import { TableAgeOfItems, Items } from '@models/age-of-items.model';
import { minus, mul, plus } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import { compact, keyBy, isEmpty } from 'lodash';

export function getSituationTransferMapped(
  data: any[],
  i18n: I18nRequestScopeService,
  transactionNow?: any,
): ReportInfo<TableAgeOfItems[]> {
  const dataMaping: ReportInfo<TableAgeOfItems[]> = {
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: '',
    dataMapped: null,
  };

  let dataExcell: TableAgeOfItems[] = [];
  if (data.length > 0) {
    dataExcell = data[0]?.warehouses?.map((item: any) => {
      dataMaping.warehouseName = item.warehouseName;
      item.items?.map((i) => {
        i?.groupByStorageDate.map((infoStock) => {
          if (transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}`]) {
            let transaction = transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}`];
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
              transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}`] = null;
            } else if (transaction?.quantityExported) {
              i.totalQuantity = minus(i.totalQuantity, transaction?.quantityExported);
              const numberCheck = minus(infoStock.stockQuantity, transaction?.quantityExported);
              if (numberCheck >= 0) {
                transactionNow[`${item.warehouseCode}-${infoStock.locatorCode}-${i.itemCode}`] = null;
                infoStock.stockQuantity = numberCheck;
              } else {
                const quantity = minus(transaction?.quantityExported, infoStock.stockQuantity);
                transaction.quantityExported = quantity;
                infoStock.stockQuantity = 0;
              }
            }
          }
        })
      })

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

  let dataExcell2: TableAgeOfItems[] = [];
  if (!isEmpty(transactionNow)) {
    if (!isEmpty(data[0].warehouses) || !data[0].warehouses) {
      const warehouseCode = data[0]?._id?.warehouseCode || '';
      const warehouseName = data[0]?._id?.warehouseName || '';
      dataMaping.warehouseName = warehouseName;
      const { arrformated, objectTransaction } = pushItemOld(transactionNow, [], warehouseCode);
      if (!isEmpty(dataExcell) || !dataExcell) {
        let arr = {
          warehouseCode:
            i18n.translate('report.WAREHOUSE_GROUP_CODE') +
            [warehouseCode, warehouseName].join('_'),
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
        dataExcell2.push(arr);
      }
    }
  }
  dataMaping.dataMapped = dataExcell || dataExcell2;
  dataMaping.dataMapped = dataMaping.dataMapped || [];
  return dataMaping;
}

function formatData(arr: any, warehouseCode: string) {
  const arrformated: any[] = [];
  for (const key in arr) {
    if (arr[key]) {
      const item = arr[key];
      if (item.quantityImported && item.warehouseCode == warehouseCode) {
        arrformated.push({
          itemCode: item.itemCode,
          itemName: item.itemName,
          totalQuantity: item.quantityImported,
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
              storageDate: item.transactionDate,
              lotNumber: item.lotNumber,
              locatorCode: item.locatorCode,
              unit: item.unit,
              stockQuantity: item.quantityImported,
              storageCost: item?.storageCost || 0,
              totalPrice: item?.totalPrice || 0,
              sixMonthAgo: item.sixMonthAgo,
              oneYearAgo: item?.oneYearAgo || 0,
              twoYearAgo: item?.twoYearAgo || 0,
              threeYearAgo: item?.threeYearAgo || 0,
              fourYearAgo: item?.fourYearAgo || 0,
              fiveYearAgo: item?.fiveYearAgo || 0,
              greaterfiveYear: item?.greaterfiveYear || 0,
            }
          ]
        })
      }
    }
  }
  return arrformated;
}

function pushItemOld(objectTransaction: any, arrItem: any[], warehouseCode?: string) {
  let keyByArrItem = keyBy(arrItem, 'itemCode');
  const arrformated: any[] = [];
  for (const key in objectTransaction) {
    const item = objectTransaction[key];
    if (item && keyByArrItem[item?.itemCode] && item?.quantityImported && item.warehouseCode == warehouseCode) {
      objectTransaction[key] = null;
      keyByArrItem[item?.itemCode].totalQuantity = plus(keyByArrItem[item?.itemCode]?.totalQuantity, item?.quantityImported) || 0;
      keyByArrItem[item.itemCode]?.groupByStorageDate?.push({
        storageDate: item.transactionDate,
        origin: item?.origin || null,
        account: item?.account || null,
        lotNumber: item.lotNumber,
        locatorCode: item.locatorCode,
        unit: item.unit,
        stockQuantity: item.quantityImported,
        storageCost: item.storageCost || 0,
        totalPrice: mul(item.storageCost, item.quantityImported),
        sixMonthAgo: item.sixMonthAgo || 0,
        oneYearAgo: item.oneYearAgo || 0,
        twoYearAgo: item.twoYearAgo || 0,
        threeYearAgo: item.threeYearAgo || 0,
        fourYearAgo: item.fourYearAgo || 0,
        fiveYearAgo: item.fiveYearAgo || 0,
        greaterfiveYear: item.greaterfiveYear || 0,
      })
    } else if (item && item?.quantityImported && item.warehouseCode == warehouseCode) {
      objectTransaction[key] = null;
      keyByArrItem[item?.itemCode] = {
        itemCode: item.itemCode,
        itemName: item.itemName,
        totalQuantity: item.quantityImported,
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
            storageDate: item.transactionDate,
            lotNumber: item.lotNumber,
            locatorCode: item.locatorCode,
            unit: item.unit,
            stockQuantity: item.quantityImported,
            storageCost: item?.storageCost || 0,
            totalPrice: item?.totalPrice || 0,
            sixMonthAgo: item.sixMonthAgo,
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
  }
  for (const key in keyByArrItem) {
    arrformated.push(keyByArrItem[key]);
  }
  return {
    arrformated: arrformated as Array<Items>,
    objectTransaction: objectTransaction,
  };
}