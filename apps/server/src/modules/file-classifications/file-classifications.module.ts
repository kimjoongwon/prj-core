import { Module } from '@nestjs/common';
import { FileClassificationsController } from '@shared/backend';

@Module({
  controllers: [FileClassificationsController],
})
export class FileClassificationsModule {}
