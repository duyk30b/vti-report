export interface WarehouseServiceInterface {
  getWarehouseByCode(code: string): Promise<any>;
}
