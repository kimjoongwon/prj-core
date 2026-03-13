import { ActionFacade } from "@cocrepo/facade";
import { ActionService } from "@cocrepo/service";
import { ActionsRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { ActionsController } from "./actions.controller";

@Module({
	providers: [ActionFacade, ActionService, ActionsRepository],
	controllers: [ActionsController],
	exports: [ActionFacade],
})
export class ActionsModule {}
