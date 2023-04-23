export interface UserServiceInterface {
  getCompanies(condition): Promise<any>;
  getUserByIds(condition, serilize?: boolean): Promise<any>;
  getFactoriesByIds(condition, serilize?: boolean): Promise<any>;
  getFactories(condition): Promise<any>;
  deleteRecordUserWarehouses(condition): Promise<any>;
  getUsersByConditions(condition): Promise<any>;
  getUsersByUsernameOrFullName(filterByUser, onlyId?): Promise<any>;
  insertPermission(permissions): Promise<any>;
  deletePermissionNotActive(): Promise<any>;
  getUserById(id: number): Promise<any>;
  getUserWarehousesById(id: number): Promise<any>;
  getFactoriesByNameKeyword(
    filterByName,
    onlyId?: boolean,
    serilize?: boolean,
  ): Promise<any>;
  getUsersByRoleCodes(roleCodes?: string[]): Promise<any>;
  getFactoryById(id: number): Promise<any>;
  getListDepartment(): Promise<any>;
  getDepartmentReceiptByIds(ids: number[]): Promise<any>;
  getDepartmentSettingByIds(ids: number[], serilize?: boolean): Promise<any>;
  getListCompanyByIds(ids: number[], serilize?: boolean): Promise<any>;
  getListCompanyByCodes(codes: string[], serilize?: boolean): Promise<any>;
}
