import { BaseModel } from '@core/model/base.model';
import { FilterQuery, Model, Types } from 'mongoose';
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
    return await this.model.findOne({
      _id: id,
      deletedAt: null,
    } as any);
  }

  public async findOneByCode(code: string): Promise<T> {
    return await this.model.findOne({
      code,
      deletedAt: null,
    } as any);
  }

  public async findOneByCondition(filterCondition: any): Promise<T> {
    const condition = filterCondition?.id
      ? {
          _id: filterCondition?.id,
          deletedAt: null,
          ...filterCondition,
        }
      : filterCondition;
    return await this.model.findOne(condition);
  }

  public async findAll(): Promise<T[]> {
    return await this.find();
  }

  public async remove(id: string): Promise<any> {
    return await this.model.remove(id);
  }

  public async findByIdAndUpdate(id: string, data: T | any): Promise<any> {
    return await this.model.findByIdAndUpdate({ _id: id }, data);
  }

  public async deleteByCondition(condition: any): Promise<any> {
    return await this.model.deleteOne(condition);
  }

  public async updateByCondition(condition: any, data: T | any): Promise<any> {
    return await this.model.updateOne(condition, data);
  }

  public async findAllByCondition(condition: any): Promise<any> {
    return await this.find(condition);
  }

  public async createMany(data: T | any): Promise<any> {
    return await this.model.insertMany(data);
  }

  public async softDelete(id: string, userId?: number): Promise<any> {
    return await this.model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          deletedAt: null,
        } as any,
        {
          deletedAt: new Date(),
          deletedBy: userId,
        } as any,
      )
      .exec();
  }

  public async findAllWithPopulate(
    condition: any,
    populate: string,
  ): Promise<T[]> {
    return await this.model.find(condition).populate(populate).exec();
  }

  public async findOneWithPopulate(
    condition: FilterQuery<T>,
    populate: string,
  ): Promise<any> {
    return await this.model.findOne(condition).populate(populate).exec();
  }

  public async find(condition?: any): Promise<any> {
    return await this.model.find({
      ...condition,
      deletedAt: null,
    });
  }

  public async count(condition?: any): Promise<number> {
    return await this.model.count(condition).exec();
  }

  public async updateManyByCondition(
    condition: any,
    dataUpdate: any,
  ): Promise<any> {
    return await this.model.updateMany(condition, dataUpdate).exec();
  }

  public async createOrUpdate(dataUpdate: any): Promise<any> {
    return await this.model.findOneAndUpdate(
      { _id: dataUpdate._id },
      dataUpdate,
      { upsert: true, new: true, runValidators: true },
    );
  }
}
