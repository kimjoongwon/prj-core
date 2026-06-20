import { SpaceContext } from "@cocrepo/context";
import { CourseAggregate } from "@cocrepo/aggregate";
import { CoursesController } from "@cocrepo/controller";
import {
	CoursesRepository,
	PaymentsRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import { CourseCommandHandlers, CourseQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [CoursesController],
	providers: [
		CourseAggregate,
		CoursesRepository,
		PaymentsRepository,
		TimelinesRepository,
		SpaceContext,
		...CourseCommandHandlers,
		...CourseQueryHandlers,
	],
})
export class CoursesModule {}
