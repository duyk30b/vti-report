import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExampleRepository } from '@repositories/example.repository';
import { ExampleSchema } from 'src/schemas/example.schema';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Example', schema: ExampleSchema }]),
  ],
  providers: [
    {
      provide: 'SyncService',
      useClass: SyncService,
    },
  ],
  controllers: [SyncController],
})
export class SyncModule {}
