import { BaseAbstractRepository } from '@core/repository/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExampleModel } from 'src/models/example.model';
import { ExampleRequest } from 'src/requests/example/example.request';

@Injectable()
export class ExampleRepository extends BaseAbstractRepository<ExampleModel> {
  constructor(
    @InjectModel('Example')
    private readonly exampleModel: Model<ExampleModel>,
  ) {
    super(exampleModel);
  }

  async create(request: ExampleRequest): Promise<ExampleModel> {
    const document = new this.exampleModel();
    document.name = request.name;
    await document.save();
    return document;
  }
}
