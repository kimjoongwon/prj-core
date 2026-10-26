import { AbilityAggregate } from "@cocrepo/aggregate";
import { AbilitiesController } from "@cocrepo/controller";
import { RoleAssignmentsRepository } from "@cocrepo/repository";
import { AbilityQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [AbilitiesController],
	providers: [
		AbilityAggregate,
		RoleAssignmentsRepository,
		...AbilityQueryHandlers,
	],
})
export class AbilitiesModule {}
