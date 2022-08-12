import { BaseModel } from '@core/model/base.model';
import { Model } from 'mongoose';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T extends BaseModel>
  implements BaseInterfaceRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
  public async create(data: T | any): Promise<T> {
    return await this.model.create(data);
  }

  public async findOneById(id: string): Promise<T> {
    return await this.model.findById(id);
  }

  public async findOneByCondition(filterCondition: any): Promise<T> {
    return await this.model.findOne(filterCondition);
  }

  public async findWithRelations(relations: any): Promise<T[]> {
    return await this.model.find(relations);
  }

  public async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  public async count(filterCondition: any): Promise<number> {
    return await this.model.count(filterCondition);
  }

  public async remove(id: string): Promise<any> {
    return await this.model.remove(id);
  }

  public async findByIdAndUpdate(id: string, data: T | any): Promise<any> {
    return await this.model.findByIdAndUpdate({ _id: id }, data);
  }

  public async findByIdAndRemove(id: string): Promise<any> {
    return await this.model.findByIdAndRemove(id);
  }

  public async deleteById(id: T | any): Promise<any> {
    return await this.model.deleteOne({ _id: id });
  }

  public async updateById(id: T | any, data: T | any): Promise<any> {
    return await this.model.updateOne({ _id: id }, data);
  }
}
