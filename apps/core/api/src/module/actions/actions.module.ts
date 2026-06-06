import { ActionAggregateRoot } from "@cocrepo/aggregate";
import { ActionsRepository } from "@cocrepo/repository";
import { ActionCommandHandlers, ActionQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ActionsController } from "./actions.controller";

@Module({
	imports: [CqrsModule],
	providers: [
		ActionAggregateRoot,
		ActionsRepository,
		...ActionCommandHandlers,
		...ActionQueryHandlers,
	],
	controllers: [ActionsController],
})
export class ActionsModule {}
