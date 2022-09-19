import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [MongooseModule.forFeature([])],
  providers: [
    {
      provide: 'SyncService',
      useClass: SyncService,
    },
  ],
  controllers: [SyncController],
})
export class SyncModule {}
