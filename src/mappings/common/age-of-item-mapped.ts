import { TableAgeOfItems } from '@models/age-of-items.model';
import { minus, plus } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import { compact } from 'lodash';

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
      const itemFormat = formatData(transactionNow, item.warehouseCode);
      itemFormat.map((i) => {
        item.items.push(i)
      })
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
  dataMaping.dataMapped = dataExcell || [];

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
