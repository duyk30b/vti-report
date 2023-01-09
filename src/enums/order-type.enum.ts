export enum OrderType {
  EXPORT = 0,
  IMPORT = 1,
  INVENTORY = 2,
  TRANSFER = 3,
  INVENTORY_ADJUSTMENTS_IMPORT = 4,
  INVENTORY_ADJUSTMENTS_EXPORT = 5,
}

export enum OrderTypeEnum {
  POI = 0,
  PO = 1,
  PRO = 2,
  SO = 3,
  TRANSFER = 4,
  IMO = 5,
  EXO = 6,
  RO = 7,
  PROPOSAL = 8,
  SWIFT_LOCATOR = 9,
}

export enum WarehouseMovementTypeEnum {
  PO_IMPORT = 0,
  PO_EXPORT = 1,
  PRO_IMPORT = 2,
  PRO_EXPORT = 3,
  SO_IMPORT = 4,
  SO_EXPORT = 5,
  TRANFER_IMPORT = 6,
  TRANFER_EXPORT = 7,
  IMO_IMPORT = 8,
  EXO_EXPORT = 9,
  PO_IMPORT_RETURN = 10,
  SO_EXPORT_RETURN = 11,
  RETURN_IMPORT = 12,
  RETURN_EXPORT = 13,
  RETURN_PO_ERROR = 14,
  RETURN_SO_ERROR = 15,
  SWIFT_FLOOR_IMPORT = 16,
  SWIFT_FLOOR_EXPORT = 17,
  PO_IMPORT_RECEIVE = 18,
  PO_EXPORT_RECEIVE = 19,
}

export const MOVEMENT_TYPE_IMPORT = [
  WarehouseMovementTypeEnum.PO_IMPORT,
  WarehouseMovementTypeEnum.TRANFER_IMPORT,
];

export const TRANSACTION_MOVEMENT_TYPE_IMPORT_EXPORT = [
  WarehouseMovementTypeEnum.PO_IMPORT_RECEIVE,
  WarehouseMovementTypeEnum.TRANFER_IMPORT,
  WarehouseMovementTypeEnum.TRANFER_EXPORT,
  WarehouseMovementTypeEnum.SO_EXPORT,
];
