export enum OrderStatus {
  IMPORTED = 1, //Đã nhập kho
  EXPORTED = 2, // Đã xuất kho
  TRANSFERED = 3, //Đã chuyển kho
  STORED = 4, //Đã cất hàng
  RECEIVED = 5, //Đã nhận hàng
  CONFIRMED = 6, // Đã xác nhận

  IMPORTING = 7, //Dang nhap kho
  EXPORTING = 8, //Dang xuat kho
  STORING = 9,
  TRANSFERING = 10,
  RECEIVING = 11,
  CONFIRMING = 12,

  NOT_YET_EXPORT = 13,
  NOT_YET_IMPORT = 14,
  NOT_YET_TRANSFER = 15,
  NOT_YET_STORE = 16,
  NOT_YET_RECEIVE = 17,
  NOT_YET_CONFIRM = 18,

  EXPORT_INCOMPLETED = 19,
  IMPORT_INCOMPLETED = 20,
  TRANSFER_INCOMPLETED = 21,
  EXPORT_COMPLETED = 22,
  IMPORT_COMPLETED = 23,
  TRANSFER_COMPLETED = 24,
}
