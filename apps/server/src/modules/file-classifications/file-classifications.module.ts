import { Module } from '@nestjs/common';
import { FileClassificationsController } from '../../shared';

@Module({
  controllers: [FileClassificationsController],
})
export class FileClassificationsModule {}
