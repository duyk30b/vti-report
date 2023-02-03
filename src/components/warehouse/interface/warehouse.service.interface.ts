export interface WarehouseServiceInterface {
  getWarehouseByCode(code: string): Promise<any>;
  getWarehouseByCodes(codes: string[]): Promise<any>;
}
