import { SubjectAggregate } from "@cocrepo/aggregate";
import { SubjectsController } from "@cocrepo/controller";
import { SubjectsRepository } from "@cocrepo/repository";
import { SubjectCommandHandlers, SubjectQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
