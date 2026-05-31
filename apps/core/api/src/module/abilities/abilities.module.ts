import {
	AbilitiesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	UserPoliciesRepository,
} from "@cocrepo/repository";
import { AbilityAggregateRoot } from "@cocrepo/aggregate";
import { AbilityCommandHandlers, AbilityQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AbilitiesController } from "./abilities.controller";

@Module({
	imports: [CqrsModule],
	controllers: [AbilitiesController],
	providers: [
		AbilityAggregateRoot,
		AbilitiesRepository,
		PolicyAbilitiesRepository,
		RolePoliciesRepository,
		UserPoliciesRepository,
		...AbilityCommandHandlers,
		...AbilityQueryHandlers,
	],
})
export class AbilitiesModule {}
