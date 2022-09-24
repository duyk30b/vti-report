import { SortOrder, SORT_CONST } from '@core/common';

declare global {
  interface String {
    toSortOrder(plainOrder: string): SortOrder;
  }
}

String.prototype.toSortOrder = function (this: string) {
  if (!this) return null;

  switch (this.toLowerCase()) {
    case SORT_CONST.ASCENDING:
      return SortOrder.Ascending;
    case SORT_CONST.DESCENDING:
      return SortOrder.Descending;
    default:
      return null;
  }
};
