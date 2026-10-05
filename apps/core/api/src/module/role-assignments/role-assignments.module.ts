import { RoleAssignmentAggregate } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/context";
import { RoleAssignmentsController } from "@cocrepo/controller";
import {
	PoliciesRepository,
	RoleAssignmentsRepository,
	RolesRepository,
} from "@cocrepo/repository";
import {
	RoleAssignmentCommandHandlers,
	RoleAssignmentQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [RoleAssignmentsController],
	providers: [
		RoleAssignmentAggregate,
		PoliciesRepository,
		RoleAssignmentsRepository,
		RolesRepository,
		SpaceContext,
		...RoleAssignmentCommandHandlers,
		...RoleAssignmentQueryHandlers,
	],
})
export class RoleAssignmentsModule {}
