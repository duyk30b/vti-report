export enum OrderStatus {
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

export enum WarehouseTransferStatusEnum {
  CREATED = 0,
  PENDING = 1,
  COMPLETED = 2,
  REJECTED = 3,
  CONFIRMED = 4,
  EXPORTING = 5,
  INRECEIVING = 6,
  RECEIVED = 7,
  INCOLLECTING = 8,
  COLLECTED = 9,
  EXPORTED = 10,
  INSTORING = 11,
  INPROGRESS = 12,
}

export const WAREHOUSE_EXPORT_RECEIPT_STATUS_MAP = {
  [OrderStatus.Pending]: 'statusSoExport.pending',
  [OrderStatus.Confirmed]: 'statusSoExport.confirmed',
  [OrderStatus.InCollecting]: 'statusSoExport.inCollecting',
  [OrderStatus.Completed]: 'statusSoExport.completed',
  [OrderStatus.Reject]: 'statusSoExport.rejected',
  [OrderStatus.Collected]: 'statusSoExport.collected',
};
