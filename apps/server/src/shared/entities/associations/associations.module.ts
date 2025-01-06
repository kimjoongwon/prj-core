import { Module } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { AssociationsRepository } from './associations.repository';

@Module({
  providers: [AssociationsService, AssociationsRepository],
  exports: [AssociationsService],
})
export class AssociationsModule {}
