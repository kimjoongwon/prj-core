import { ActionsApplicationService } from "@cocrepo/app";
import { ActionsService } from "@cocrepo/service";
import { ActionsRepository } from "@cocrepo/repository";
import { Module } from "@nestjs/common";
import { ActionsController } from "./actions.controller";

@Module({
	providers: [ActionsApplicationService, ActionsService, ActionsRepository],
	controllers: [ActionsController],
	exports: [ActionsApplicationService],
})
export class ActionsModule {}
