import { Module } from '@nestjs/common';
import { FilesController } from '@shared/backend';

@Module({
  controllers: [FilesController],
})
export class FilesModule {}

@Module({
  controllers: [FilesController],
})
export class FileModule {}
