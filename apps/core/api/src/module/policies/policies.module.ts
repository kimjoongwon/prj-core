import { PolicyAggregateRoot } from "@cocrepo/aggregate";
import {
	AbilitiesRepository,
	PoliciesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	UserPoliciesRepository,
} from "@cocrepo/repository";
import { SpaceContext } from "@cocrepo/service";
import { PolicyCommandHandlers, PolicyQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PoliciesController } from "./policies.controller";

@Module({
	imports: [CqrsModule],
	controllers: [PoliciesController],
	providers: [
		PolicyAggregateRoot,
		PoliciesRepository,
		PolicyAbilitiesRepository,
		AbilitiesRepository,
		RolePoliciesRepository,
		UserPoliciesRepository,
		SpaceContext,
		...PolicyCommandHandlers,
		...PolicyQueryHandlers,
	],
})
export class PoliciesModule {}
