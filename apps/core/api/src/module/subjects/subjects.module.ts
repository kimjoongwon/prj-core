import { SubjectsRepository } from "@cocrepo/repository";
import { SubjectAggregateRoot } from "@cocrepo/aggregate";
import { SubjectCommandHandlers, SubjectQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SubjectsController } from "./subjects.controller";

@Module({
	imports: [CqrsModule],
	providers: [
		SubjectAggregateRoot,
		SubjectsRepository,
		...SubjectCommandHandlers,
		...SubjectQueryHandlers,
	],
	controllers: [SubjectsController],
})
export class SubjectsModule {}
