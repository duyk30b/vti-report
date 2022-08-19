import { BaseModel } from '@core/model/base.model';

export interface BaseInterfaceRepository<T extends BaseModel> {
  create(data: T | any): Promise<T>;

  findOneById(id: number | string): Promise<T>;

  findOneByCode(code: string): Promise<T>;

  findOneByCondition(filterCondition: any): Promise<T>;

  findAll(): Promise<T[]>;

  remove(id: string): Promise<any>;

  findByIdAndUpdate(id: string, data: T | any): Promise<T>;

  deleteByCondition(condition: any): Promise<any>;

  updateByCondition(condition: any, data: T | any): Promise<any>;

  findAllByCondition(condition: any): Promise<T[]>;

  createMany(data: T | any): Promise<any>;

  softDelete(id: string, userId?: number): Promise<any>;

  count(condition?: any): Promise<number>;

  updateManyByCondition(condition: any, dataUpdate: any): Promise<any>;

  createOrUpdate(dataUpdate: any): Promise<any>;
}
