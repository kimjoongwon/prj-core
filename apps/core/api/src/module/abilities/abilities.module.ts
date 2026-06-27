import { AbilityAggregate } from "@cocrepo/aggregate";
import { AbilitiesController } from "@cocrepo/controller";
import {
	AbilitiesRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
} from "@cocrepo/repository";
import { AbilityCommandHandlers, AbilityQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [AbilitiesController],
	providers: [
		AbilityAggregate,
		AbilitiesRepository,
		PolicyAbilitiesRepository,
		RolePoliciesRepository,
		...AbilityCommandHandlers,
		...AbilityQueryHandlers,
	],
})
export class AbilitiesModule {}
