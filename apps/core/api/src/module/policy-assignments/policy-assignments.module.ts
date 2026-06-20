import { PolicyAssignmentAggregate } from "@cocrepo/aggregate";
import {
	PoliciesRepository,
	RolePoliciesRepository,
	RolesRepository,
	UserPoliciesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { SpaceContext } from "@cocrepo/service";
import {
	PolicyAssignmentCommandHandlers,
	PolicyAssignmentQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PolicyAssignmentsController } from "@cocrepo/controller";

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
