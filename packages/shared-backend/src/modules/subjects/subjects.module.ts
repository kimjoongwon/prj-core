import { Module, OnModuleInit } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [SubjectsService, PrismaService],
  exports: [SubjectsService],
})
export class SubjectsModule implements OnModuleInit {
  constructor(private readonly subjectsService: SubjectsService) {}
  onModuleInit() {
    // this.subjectsService.createSubjects();
  }
}
