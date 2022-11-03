export const IMPORT_ACTION = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  NO: 'NO',
  DONE: 'DONE',
};

export const FILE_TYPE = {
  XLSX: {
    MIME_TYPE:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    EXT: 'xlsx',
  },
  CSV: {
    MIME_TYPE: 'text/csv',
    EXT: 'csv',
  },
};

export const IMPORT_CONST = {
  SHEET: {
    DATA_SHEET_NAME: 'Data',
    HEADER_ROW: 1,
    DATA_START_ROW: 2,
    HEADER_ROW_COUNT: 1,
  },
  ACTION_HEADER: {
    COL_NAME: ['Hành động', 'Action', '操作'],
    DB_COL_NAME: 'ACTION',
    MAX_LENGTH: 255,
    ALLOW_NULL: false,
  },
  ACTIONS: [IMPORT_ACTION.ADD, IMPORT_ACTION.UPDATE, IMPORT_ACTION.NO],
  COL_OFFSET: {
    DEFAULT: 0,
    CSV: 1,
  },
  TYPE_OF_ROW: 'Row',
  LOG_FILE_NAME: `import_log-{0}-{1}.${FILE_TYPE.CSV.EXT}`,
  UNICODE_PREFIX: '\uFEFF',
  ERR_CODE: {
    FILE_NOT_FOUND: 'ENOENT',
  },
  OUTPUT_FLAG: {
    WRITE: 'w',
  },
  DEFAULT_ENCODING: {
    TEXT: 'utf8',
    ENCODE: 'base64',
  },
};

export enum FILE_NAME_ENUM {
  WAREHOUSE = 1,
  WAREHOUSE_SHELF = 2,
  WAREHOUSE_SECTOR = 3,
  WAREHOUSE_PALLET = 4,
}

export const FILE_NAME_MAP = {
  1: 'warehouse-input.xlsx',
  2: 'warehouse-shelf-input.xlsx',
  3: 'warehouse-sector-input.xlsx',
  4: 'warehouse-floor-input.xlsx',
};
