import { AssignmentsRepository } from "@cocrepo/repository";
import { AssignmentsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AssignmentsController } from "@shared";

@Module({
	controllers: [AssignmentsController],
	providers: [AssignmentsService, AssignmentsRepository],
})
export class AssignmentsModule {}
