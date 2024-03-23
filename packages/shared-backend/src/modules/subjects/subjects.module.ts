import { Module, OnModuleInit } from '@nestjs/common';
import { SubjectsService } from './subjects.service';

@Module({
  providers: [SubjectsService],
})
export class SubjectsModule implements OnModuleInit {
  constructor(private readonly subjectsService: SubjectsService) {}
  onModuleInit() {
    // this.subjectsService.createSubjects();
  }
}
