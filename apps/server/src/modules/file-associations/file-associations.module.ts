import { Module } from '@nestjs/common';
import { FileAssociationsController, FileAssociationsRepository, FileAssociationsService } from '@shared/backend';

@Module({
  controllers: [FileAssociationsController],
  providers: [FileAssociationsService, FileAssociationsRepository],
})
export class FileAssociationsModule {}
