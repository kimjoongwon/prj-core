import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { SubjectModule, SubjectService } from '@shared';
import { Prisma } from '@prisma/client';
import { SubjectsController } from './subjects.controller';

@Module({
  imports: [SubjectModule],
  controllers: [SubjectsController],
})
export class SubjectsModule implements OnModuleInit {
  logger: Logger = new Logger(SubjectModule.name);
  constructor(private readonly subjectsService: SubjectService) {}
  async onModuleInit() {
    this.logger.log('Init Subject');
    await Promise.all(
      Object.entries(Prisma.ModelName).map(([value]) => {
        this.subjectsService.createOrUpdate({
          name: value,
        });
      }),
    );
  }
}
