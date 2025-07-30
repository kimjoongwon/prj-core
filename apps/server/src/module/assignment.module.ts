import { Module } from "@nestjs/common";
import { AssignmentsController } from "@shared";

@Module({
	controllers: [AssignmentsController],
})
export class AssignmentsModule {}
