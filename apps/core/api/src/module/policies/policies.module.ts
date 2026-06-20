import { SpaceContext } from "@cocrepo/context";
import { PolicyAggregate } from "@cocrepo/aggregate";
import { PoliciesController } from "@cocrepo/controller";
import {
	AbilitiesRepository,
	PoliciesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	UserPoliciesRepository,
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
