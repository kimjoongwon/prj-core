import { ActionAggregate } from "@cocrepo/aggregate";
import { ActionsController } from "@cocrepo/controller";
import { ActionsRepository } from "@cocrepo/repository";
import { ActionCommandHandlers, ActionQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	providers: [
		ActionAggregate,
		ActionsRepository,
		...ActionCommandHandlers,
		...ActionQueryHandlers,
	],
	controllers: [ActionsController],
})
export class ActionsModule {}
