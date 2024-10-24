import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';
import { LecturesRepository } from './lectures.repository';

@Module({
  controllers: [LecturesController],
  providers: [LecturesService, LecturesRepository],
  exports: [LecturesService],
})
export class LecturesModule {}
