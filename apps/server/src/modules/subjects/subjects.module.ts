import { Module } from '@nestjs/common';
import { SubjectsController } from '@shared/backend';

@Module({
  controllers: [SubjectsController],
})
export class SubjectsModule {}
