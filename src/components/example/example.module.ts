import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExampleRepository } from '@repositories/example.repository';
import { ExampleSchema } from 'src/schemas/example.schema';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Example', schema: ExampleSchema }]),
  ],
  providers: [
    {
      provide: 'ExampleService',
      useClass: ExampleService,
    },
    {
      provide: 'ExampleRepository',
      useClass: ExampleRepository,
    },
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
