import { PolicyAssignmentFacade } from "@cocrepo/facade";
import {
	PoliciesRepository,
	RolePoliciesRepository,
	RolesRepository,
	UserPoliciesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { PolicyAssignmentService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { PolicyAssignmentsController } from "./policy-assignments.controller";

@Module({
	controllers: [PolicyAssignmentsController],
	providers: [
		PolicyAssignmentFacade,
		PolicyAssignmentService,
		PoliciesRepository,
		RolePoliciesRepository,
		UserPoliciesRepository,
		RolesRepository,
		UsersRepository,
		SpaceContext,
	],
	exports: [PolicyAssignmentFacade],
})
export class PolicyAssignmentsModule {}
