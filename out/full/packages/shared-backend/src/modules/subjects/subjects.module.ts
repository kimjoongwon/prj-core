import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [SubjectsService, PrismaService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
