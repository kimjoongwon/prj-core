import { Module } from '@nestjs/common';
import { SubjectLogicModule, SubjectsController } from '@shared';

@Module({
  imports: [SubjectLogicModule],
  controllers: [SubjectsController],
})
export class SubjectsEndpointModule {}
