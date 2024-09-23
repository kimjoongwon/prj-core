import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { SubjectsController, SubjectsModule, SubjectsService } from '@shared';
import { Prisma } from '@prisma/client';

@Module({
  imports: [SubjectsModule],
  controllers: [SubjectsController],
})
export class AdminSubjectsModule implements OnModuleInit {
  logger: Logger = new Logger(AdminSubjectsModule.name);
  constructor(private readonly subjectsService: SubjectsService) {}
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
