import { Module } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { LecturesRepository } from './lectures.repository';
import { LecturesController } from './lectures.controller';

@Module({
  controllers: [LecturesController],
  providers: [LecturesService, LecturesRepository],
  exports: [LecturesService],
})
export class LecturesModule {}
