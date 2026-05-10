import { CourseApplicationService } from "@cocrepo/app";
import { CourseFacade } from "@cocrepo/facade";
import {
	CoursesRepository,
	PaymentsRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import { AuthContext, CourseService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller";

@Module({
	controllers: [CoursesController],
	providers: [
		CourseFacade,
		CourseApplicationService,
		CourseService,
		CoursesRepository,
		PaymentsRepository,
		TimelinesRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [CourseFacade, CourseApplicationService],
})
export class CoursesModule {}
