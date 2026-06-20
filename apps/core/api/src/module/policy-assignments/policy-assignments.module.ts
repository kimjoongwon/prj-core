import { SpaceContext } from "@cocrepo/context";
import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import { PolicyAssignmentsController } from "@cocrepo/controller";
import {
	PoliciesRepository,
	RolePoliciesRepository,
	RolesRepository,
	UserPoliciesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	PolicyAssignmentCommandHandlers,
	PolicyAssignmentQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [PolicyAssignmentsController],
	providers: [
		PolicyAssignmentAggregate,
		PoliciesRepository,
		RolePoliciesRepository,
		UserPoliciesRepository,
		RolesRepository,
		UsersRepository,
		SpaceContext,
		...PolicyAssignmentCommandHandlers,
		...PolicyAssignmentQueryHandlers,
	],
})
export class PolicyAssignmentsModule {}
