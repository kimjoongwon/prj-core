import { AbilityAggregate } from "@cocrepo/aggregate";
import {
	AbilitiesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	UserPoliciesRepository,
} from "@cocrepo/repository";
import { AbilityCommandHandlers, AbilityQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AbilitiesController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [AbilitiesController],
	providers: [
		AbilityAggregate,
		AbilitiesRepository,
		PolicyAbilitiesRepository,
		RolePoliciesRepository,
		UserPoliciesRepository,
		...AbilityCommandHandlers,
		...AbilityQueryHandlers,
	],
})
export class AbilitiesModule {}
