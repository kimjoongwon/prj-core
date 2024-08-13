import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsRepository, SubjectsService } from '@shared';
import { Prisma } from '@prisma/client';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectsRepository],
})
export class SubjectsModule implements OnModuleInit {
  logger: Logger = new Logger(SubjectsModule.name);
  constructor(private readonly subjectsService: SubjectsService) {}
  async onModuleInit() {
    this.logger.log('Init Subjects');
    await Promise.all(
      Object.entries(Prisma.ModelName).map(([value]) => {
        this.subjectsService.createOrUpdate({
          name: value,
        });
      }),
    );
  }
}
