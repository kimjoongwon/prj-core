import { PolicyAggregate } from "@cocrepo/aggregate";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { PoliciesController } from "@cocrepo/controller";
import {
	AbilitiesRepository,
	PoliciesRepository,
	PolicyEntriesRepository,
	RoleAssignmentsRepository,
} from "@cocrepo/repository";
import { PolicyCommandHandlers, PolicyQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [PoliciesController],
	providers: [
		PolicyAggregate,
		PoliciesRepository,
		PolicyEntriesRepository,
		AbilitiesRepository,
		RoleAssignmentsRepository,
		SpaceContext,
		AuthContext,
		...PolicyCommandHandlers,
		...PolicyQueryHandlers,
	],
})
export class PoliciesModule {}
