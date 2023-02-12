import * as moment from "moment";

export enum APIPrefix {
  Version = 'api/v1',
}

export const DATA_NOT_CHANGE = {
  DEFAULT_WAREHOUSE_TYPE_SETTINGS: [
    {
      code: '00',
      name: 'thành phẩm',
    },
    {
      code: '01',
      name: 'nguyên vật liệu',
    },
  ],
};

//permission
export enum StatusPermission {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum ITEM_LOCATION_TYPE_ENUM {
  EVEN = 0,
  ODD = 1,
}

export const ITEM_LOCATION_ENUM = [
  ITEM_LOCATION_TYPE_ENUM.EVEN,
  ITEM_LOCATION_TYPE_ENUM.ODD,
];

export const FORMAT_CODE_PERMISSION = 'WAREHOUSE_';

export const ROLE = {
  ADMIN: '01',
  EMPLOYEE: '02',
  PM: '03',
  LEADER: '04',
};
export enum QUEUES_NAME_ENUM {
  SYNC_DATA_QUEUE = 'SYNC_DATA_QUEUE',
}

export enum INVENTORY_ADJUSTMENT_TYPE {
  IMPORT = 0,
  EXPORT = 1,
}

export function formatNumber(number: any) {
  if (number && typeof number === 'number') {
    const num = number.toString();
    if (num.split('.')[1]) {
      return num.split('.')[0] + ',' + num.split('.')[1];
    } else return num.split('.')[0];
  }
  else {
    return ''
  }
}
export function readDecimal(number: any, isFormat?: boolean): string {
  const checkInt = Number(number) % 1;
  if(isFormat && !number ) return '0';
  if (!number) return ''
  let num = number.toString();
  if(num.includes(',')) num = num.split(',')[0] + '.' + num.split(',')[1];
  let x = 3;
  let n = 2;
  let numPri = parseFloat(num).toFixed(2);
  if (checkInt == 0) {
    numPri = num + '.0';
  }
  let re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  let numReturn = numPri.replace(new RegExp(re, 'g'), '$1 ');
  if (checkInt == 0) {
    return numReturn.split('.')[0];
  }
  if (numReturn.split('.')[1] === '00') {
    return numReturn.split('.')[0];    
  } else return numReturn.split('.')[0] + ',' + numReturn.split('.')[1];
}

export function formatMoney(number: any, isDecimal?: number) {
  number = number || 0;
  isDecimal = isDecimal || 0;
  const num = number.toString();
  const x = 3;
  const n = 2;
  let numPri= parseFloat(num).toFixed(isDecimal);
  let re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  let numReturn =numPri.replace(new RegExp(re, 'g'), '$1 ');
  if (isDecimal) {
    return numReturn.split('.')[0] + ',' + numReturn.split('.')[1];
  }
  return numReturn.split('.')[0];
};

export function formatDate(date: any) {
  if (!date) return '';
  const dateFormated = moment(date).format('DD/MM/YYYY') || '';
  return dateFormated;
}