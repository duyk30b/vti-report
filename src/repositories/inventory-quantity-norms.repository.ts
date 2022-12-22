import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryQuantityNormModel } from '@schemas/inventory-quantity-norms.model';
import { InventoryQuantityNormsInterface } from '@schemas/interface/inventory-quantity-norms';
@Injectable()
export class InventoryQuantityNormsRepository extends BaseAbstractRepository<InventoryQuantityNormModel> {
  constructor(
    @InjectModel(InventoryQuantityNormModel.name)
    private readonly inventoryQuantityNorms: Model<InventoryQuantityNormModel>,
  ) {
    super(inventoryQuantityNorms);
  }

  async createOne(
    inventoryQuantityNorms: InventoryQuantityNormsInterface,
  ): Promise<void> {
    const document = new this.inventoryQuantityNorms();
    Object.assign(document, inventoryQuantityNorms);
    await document.save();
  }

  async saveMany(
    inventoryQuantityNorms: InventoryQuantityNormsInterface[],
  ): Promise<any> {
    return this.inventoryQuantityNorms.create(inventoryQuantityNorms);
  }

}
