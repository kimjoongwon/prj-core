import { SubjectAggregate } from "@cocrepo/aggregate";
import { SubjectsRepository } from "@cocrepo/repository";
import { SubjectCommandHandlers, SubjectQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SubjectsController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	providers: [
		SubjectAggregate,
		SubjectsRepository,
		...SubjectCommandHandlers,
		...SubjectQueryHandlers,
	],
	controllers: [SubjectsController],
})
export class SubjectsModule {}
