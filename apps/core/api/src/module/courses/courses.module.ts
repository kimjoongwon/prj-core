import { CourseAggregate } from "@cocrepo/aggregate";
import {
	CoursesRepository,
	PaymentsRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import { SpaceContext } from "@cocrepo/service";
import { CourseCommandHandlers, CourseQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CoursesController } from "@cocrepo/controller";

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
