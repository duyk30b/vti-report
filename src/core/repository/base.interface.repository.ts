import { BaseModel } from '@core/model/base.model';

export interface BaseInterfaceRepository<T extends BaseModel> {
  create(data: T | any): Promise<T>;

  findOneById(id: number | string): Promise<T>;

  findOneByCondition(filterCondition: any): Promise<T>;

  findAll(): Promise<T[]>;

  remove(id: string): Promise<any>;

  findWithRelations(relations: any): Promise<T[]>;

  findByIdAndUpdate(id: string, data: T | any): Promise<T>;

  findByIdAndRemove(id: string): Promise<any>;

  deleteById(id: string): Promise<any>;

  updateById(id: string, data: T | any): Promise<any>;
}
