import Big from 'big.js';
const moment = require('moment-timezone');
export const minus = (first: number, second: number): number => {
  return Number(new Big(first).minus(new Big(second)));
};

export const plus = (first: number, second: number): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export const mul = (first: number, second: number): number => {
  return Number(new Big(first).mul(new Big(second)));
};

export const div = (first: number, second: number): number => {
  return Number(new Big(first).div(new Big(second ? second : 1)));
};

export const plusBigNumber = (first: any, second: any): any => {
  return new Big(first || 0).plus(new Big(second || 0)).valueOf();
};

export const minusBigNumber = (first: any, second: any): any => {
  return new Big(first).minus(new Big(second)).valueOf();
};

export const mulBigNumber = (first: any, second: any): any => {
  return new Big(first || 0).mul(new Big(second || 0)).valueOf();
};

export const divBigNumber = (first: any, second: any): any => {
  return new Big(first).div(new Big(+second ? second : 1)).valueOf();
};

export const escapeCharForSearch = (str: string): string => {
  return str.toLowerCase().replace(/[?%\\_]/gi, function (x) {
    return '\\' + x;
  });
};

export function getTimezone(date?: any, format?: string) {
  return moment(date).tz('Asia/Ho_Chi_Minh').format(format);
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum RememberPassword {
  active = 1,
  inactive = 0,
}

export enum StatusPermission {
  ACTIVE = 1,
  INACTIVE = 0,
}
