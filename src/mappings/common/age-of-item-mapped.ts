import {
  TableAgeOfItems,
  SituationTransferItem,
} from '@models/age-of-items.model';
import { mulBigNumber, plusBigNumber } from '@utils/common';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import { compact, isEmpty, groupBy } from 'lodash';

export async function getSituationTransferMapped(
  data: any[],
  i18n: I18nRequestScopeService,
  transactionDateNow?: any,
): Promise<ReportInfo<TableAgeOfItems[]>> {
  const dataMaping: ReportInfo<TableAgeOfItems[]> = {
    companyCode: data[0]?._id?.companyCode || '',
    companyName: data[0]?._id?.companyName?.toUpperCase() || '',
    companyAddress: data[0]?._id?.companyAddress || '',
    warehouseName: '',
    dataMapped: null,
  };
  const companyCode = data[0]?._id?.companyCode || '';
  const arrWarehouseCode = [];
  let dataExcell: TableAgeOfItems[] = [];
  if (data.length > 0) {
    dataExcell = data[0]?.warehouses?.map((item: any) => {
      arrWarehouseCode.push(item.warehouseCode);
      dataMaping.warehouseName = item.warehouseName;
      const keyWarehouse = `${companyCode}-${item.warehouseCode}`;
      const listItemTransaction = transactionDateNow[keyWarehouse];
      delete transactionDateNow[keyWarehouse];
      const listItemGroup = groupBy(listItemTransaction, 'itemCode');
      item.totalPrice = 0;
      item.items?.map((i, index) => {
        let totalPrice = i.totalPrice || 0;
        const itemCode = i.itemCode;
        const listItem = listItemGroup[itemCode];
        delete listItemGroup[itemCode];
        if (!isEmpty(listItem)) {
          for (let j = 0; j < listItem.length; j++) {
            const price = mulBigNumber(
              listItem[j]?.quantity || 0,
              listItem[j]?.storageCost || 0,
            );
            i.totalQuantity = plusBigNumber(
              i.totalQuantity,
              listItem[j]?.quantity || 0,
            );
            switch (true) {
              case listItem[j]?.quantity > 0:
                // eslint-disable-next-line no-case-declarations
                const itemFormated = formatItemInGroup(listItem[j]);
                i?.groupByStorageDate.push(itemFormated);
                listItem[j] = null;
                break;
              case listItem[j]?.quantity === 0:
                listItem[j] = null;
                break;
              case listItem[j]?.quantity < 0:
                // eslint-disable-next-line no-case-declarations
                const groupByStorageDate = formatGroupByStorageDate(
                  i.groupByStorageDate,
                  listItem[j],
                );
                i.groupByStorageDate = groupByStorageDate;
                if (isEmpty(groupByStorageDate)) delete item.items[index];
                listItem[j] = null;
                break;
              default:
                break;
            }
            totalPrice = price ? plusBigNumber(price, totalPrice) : totalPrice;
          }
          i.totalPrice = totalPrice;
        }
        item.totalPrice = plusBigNumber(item.totalPrice, i.totalPrice);
      });
      if (!isEmpty(listItemGroup)) {
        const listItem: any = {};
        for (const key in listItemGroup) {
          const check = Object.keys(listItemGroup[key]).length ? true : false;
          Object.values(listItemGroup[key]).map((el: any) => {
            const itemCode = el?.itemCode;
            if (el?.quantity > 0) {
              if (!listItem[itemCode]) {
                const tempItem = {
                  itemCode: itemCode,
                  itemName: el?.itemName,
                  totalQuantity: el?.totalQuantity || 0,
                  storageCost: el?.storageCost || 0,
                  totalPrice: el?.totalPrice
                    ? el?.totalPrice
                    : mulBigNumber(el?.storageCost, el?.totalQuantity),
                  sixMonthAgo: el?.totalPrice
                    ? el?.totalPrice
                    : mulBigNumber(el?.storageCost, el?.totalQuantity),
                  oneYearAgo: 0,
                  twoYearAgo: 0,
                  threeYearAgo: 0,
                  fourYearAgo: 0,
                  fiveYearAgo: 0,
                  greaterfiveYear: 0,
                  groupByStorageDate: [],
                };
                const tmp = formatItemInGroup(el, check);
                tempItem.groupByStorageDate.push(tmp);
                listItem[itemCode] = tempItem;
                item.totalPrice = plusBigNumber(
                  item.totalPrice,
                  tempItem.totalPrice || 0,
                );
              } else {
                const tmp = formatItemInGroup(el);

                listItem[itemCode]?.groupByStorageDate.push(tmp);
              }
            } else if (el?.quantity < 0) {
              const groupByStorageDate = formatGroupByStorageDate(
                listItem[itemCode].groupByStorageDate,
                el,
              );
              listItem.groupByStorageDate = groupByStorageDate;
              if (isEmpty(groupByStorageDate)) delete listItem[itemCode];
            }
          });
        }
        Object.values(listItem).map((el) => {
          if (!isEmpty(el)) item.items.push(el);
        });
      }
      if (isEmpty(compact(item.items))) return [];
      updatePriceItems(item);
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
        items: compact(item.items),
      };
    });
  }
  if (!isEmpty(transactionDateNow)) {
    for (const key in transactionDateNow) {
      const itemTransaction = transactionDateNow[key];
      const listItem: any = {};
      let totalPrice = 0;
      let warehouse = '';
      Object.values(itemTransaction).map((el: any) => {
        dataMaping.warehouseName = el.warehouseName;
        warehouse = [el?.warehouseCode || '', el?.warehouseName || ''].join(
          '_',
        );
        const itemCode = el?.itemCode;
        if (el?.quantity > 0) {
          const amount = mulBigNumber(el?.quantity || 0, el?.storageCost || 0);
          totalPrice = plusBigNumber(totalPrice, amount) || 0;
          if (!listItem[itemCode]) {
            const tempItem = {
              itemCode: itemCode,
              itemName: el?.itemName,
              totalQuantity: el?.totalQuantity || 0,
              totalPrice: totalPrice,
              sixMonthAgo: totalPrice,
              oneYearAgo: 0,
              twoYearAgo: 0,
              threeYearAgo: 0,
              fourYearAgo: 0,
              fiveYearAgo: 0,
              greaterfiveYear: 0,
              groupByStorageDate: [],
            };
            const tmp = formatItemInGroup(el);
            tempItem?.groupByStorageDate.push(tmp);
            listItem[itemCode] = tempItem;
          } else {
            const tmp = formatItemInGroup(el);
            listItem[itemCode]?.groupByStorageDate.push(tmp);
          }
        }
      });
      dataExcell = dataExcell ? dataExcell : [];
      dataExcell.push({
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') + warehouse,
        sixMonth: totalPrice,
        oneYearAgo: 0,
        twoYearAgo: 0,
        threeYearAgo: 0,
        fourYearAgo: 0,
        fiveYearAgo: 0,
        greaterfiveYear: 0,
        totalPrice: totalPrice,
        items: Object.values(listItem),
      });
    }
  }
  dataMaping.dataMapped = compact(dataExcell) || [];
  return dataMaping;
}

function formatItemInGroup(
  item: any,
  checkNewItem?: boolean,
): SituationTransferItem {
  const totalPrice = checkNewItem
    ? item?.totalPrice
    : mulBigNumber(item?.storageCost, item?.totalQuantity);
  return {
    origin: item?.accountInfo[0]?.description || '',
    account: item?.accountInfo[0]?.accountHave || '',
    storageDate: item?.storageDate || '',
    lotNumber: item.lotNumber || '',
    locatorCode: item.locatorCode || '',
    unit: item.unit || '',
    stockQuantity: item?.quantity || 0,
    storageCost: item?.storageCost || 0,
    totalPrice: totalPrice || 0,
    sixMonthAgo: totalPrice || 0,
    oneYearAgo: item?.oneYearAgo || 0,
    twoYearAgo: item?.twoYearAgo || 0,
    threeYearAgo: item?.threeYearAgo || 0,
    fourYearAgo: item?.fourYearAgo || 0,
    fiveYearAgo: item?.fiveYearAgo || 0,
    greaterfiveYear: item?.greaterfiveYear || 0,
  };
}

function formatGroupByStorageDate(
  groupByStorageDate: any,
  itemTransaction: any,
) {
  let checkQuantity = itemTransaction?.quantity || 0;
  const groupFormated = [];
  groupByStorageDate.map((item) => {
    if (checkQuantity < 0) {
      item.stockQuantity = plusBigNumber(item?.stockQuantity, checkQuantity);
      checkQuantity = item.stockQuantity;
    }
    if (item.stockQuantity > 0) {
      item.totalPrice = mulBigNumber(
        itemTransaction.storageCost || 0,
        item.stockQuantity || 0,
      );
      switch (true) {
        case item.sixMonthAgo > 0:
          item.sixMonthAgo = item.totalPrice;
          break;
        case item.oneYearAgo > 0:
          item.oneYearAgo = item.totalPrice;
          break;
        case item.twoYearAgo > 0:
          item.twoYearAgo = item.totalPrice;
          break;
        case item.threeYearAgo > 0:
          item.threeYearAgo = item.totalPrice;
          break;
        case item.fourYearAgo > 0:
          item.fourYearAgo = item.totalPrice;
          break;
        case item.fiveYearAgo > 0:
          item.fiveYearAgo = item.totalPrice;
          break;
        case item.greaterfiveYear > 0:
          item.greaterfiveYear = item.totalPrice;
          break;
        default:
          break;
      }
      groupFormated.push(item);
    }
  });
  return compact(groupFormated) || [];
}

function updatePriceItems(item: TableAgeOfItems) {
  item.sixMonth = 0;
  item.oneYearAgo = 0;
  item.twoYearAgo = 0;
  item.threeYearAgo = 0;
  item.fourYearAgo = 0;
  item.fiveYearAgo = 0;
  item.greaterfiveYear = 0;
  item.totalPrice = 0;
  item.items.map((el) => {
    el.sixMonthAgo = 0;
    el.oneYearAgo = 0;
    el.twoYearAgo = 0;
    el.threeYearAgo = 0;
    el.fourYearAgo = 0;
    el.fiveYearAgo = 0;
    el.greaterfiveYear = 0;
    el.totalPrice = 0;
    el.groupByStorageDate.map((i) => {
      el.sixMonthAgo = plusBigNumber(el.sixMonthAgo, i.sixMonthAgo);
      el.oneYearAgo = plusBigNumber(el.oneYearAgo, i.oneYearAgo);
      el.twoYearAgo = plusBigNumber(el.twoYearAgo, i.twoYearAgo);
      el.threeYearAgo = plusBigNumber(el.threeYearAgo, i.threeYearAgo);
      el.fourYearAgo = plusBigNumber(el.fourYearAgo, i.fourYearAgo);
      el.fiveYearAgo = plusBigNumber(el.fiveYearAgo, i.fiveYearAgo);
      el.greaterfiveYear = plusBigNumber(el.greaterfiveYear, i.greaterfiveYear);
      el.totalPrice = plusBigNumber(el.totalPrice, i.totalPrice);
    });
    item.totalPrice = plusBigNumber(item.totalPrice, el.totalPrice);
    item.sixMonth = plusBigNumber(item.sixMonth, el.sixMonthAgo);
    item.oneYearAgo = plusBigNumber(item.oneYearAgo, el.oneYearAgo);
    item.twoYearAgo = plusBigNumber(item.twoYearAgo, el.twoYearAgo);
    item.threeYearAgo = plusBigNumber(item.threeYearAgo, el.threeYearAgo);
    item.fourYearAgo = plusBigNumber(item.fourYearAgo, el.fourYearAgo);
    item.fiveYearAgo = plusBigNumber(item.fiveYearAgo, el.fiveYearAgo);
    item.greaterfiveYear = plusBigNumber(
      item.greaterfiveYear,
      el.greaterfiveYear,
    );
  });
}
