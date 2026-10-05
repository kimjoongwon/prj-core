import { AbilityAggregate } from "@cocrepo/aggregate";
import { AbilitiesController } from "@cocrepo/controller";
import {
	AbilitiesRepository,
	PolicyEntriesRepository,
	RoleAssignmentsRepository,
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
		PolicyEntriesRepository,
		RoleAssignmentsRepository,
		...AbilityCommandHandlers,
		...AbilityQueryHandlers,
	],
})
export class AbilitiesModule {}
