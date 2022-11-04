export enum OrderStatus {
  // IMPORTED = 1, //Đã nhập kho
  // EXPORTED = 2, // Đã xuất kho
  // TRANSFERED = 3, //Đã chuyển kho
  // STORED = 4, //Đã cất hàng
  // RECEIVED = 5, //Đã nhận hàng
  // CONFIRMED = 6, // Đã xác nhận

  // IMPORTING = 7, //Dang nhap kho
  // EXPORTING = 8, //Dang xuat kho
  // STORING = 9,
  // TRANSFERING = 10,
  // RECEIVING = 11,
  // CONFIRMING = 12,

  // EXPORT_INCOMPLETED = 19,
  // IMPORT_INCOMPLETED = 20,
  // TRANSFER_INCOMPLETED = 21,
  // EXPORT_COMPLETED = 22,
  // IMPORT_COMPLETED = 23,
  // TRANSFER_COMPLETED = 24,

  Pending = 0,
  Confirmed = 1,
  InProgress = 2,
  Approved = 3,
  Completed = 4,
  Reject = 5,
  InReceiving = 6,
  Received = 7,
  Delivered = 8,
  InCollecting = 9,
  Collected = 10,
  Exported = 11,
  RejectReceived = 12,
  InProducing = 13,
  Produced = 14,
  InReturning = 15,
  Returned = 16,
  Stored = 17,
}
