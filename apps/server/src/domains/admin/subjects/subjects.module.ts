import { Module, OnModuleInit } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsRepository, SubjectsService } from '@shared';
import { Prisma } from '@prisma/client';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectsRepository],
})
export class SubjectsModule implements OnModuleInit {
  constructor(private readonly subjectsService: SubjectsService) {}
  onModuleInit() {
    Object.entries(Prisma.ModelName).map(([value]) => {
      this.subjectsService.createOrUpdate({
        name: value,
      });
    });
  }
}
