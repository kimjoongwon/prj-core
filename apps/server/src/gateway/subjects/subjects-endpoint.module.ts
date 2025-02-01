import { Module } from '@nestjs/common';
import { SubjectsController } from '@shared';

@Module({
  controllers: [SubjectsController],
})
export class SubjectsEndpointModule {}
