import { Module } from "@nestjs/common";
import {
	AssignmentsController,
	AssignmentsRepository,
	AssignmentsService,
} from "@shared";

@Module({
	controllers: [AssignmentsController],
	providers: [AssignmentsService, AssignmentsRepository],
})
export class AssignmentsModule {}
