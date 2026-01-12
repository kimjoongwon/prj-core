import { ActionsRepository } from "@cocrepo/repository";
import { ActionsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { ActionsController } from "./actions.controller";

@Module({
	providers: [ActionsService, ActionsRepository],
	controllers: [ActionsController],
	exports: [ActionsService],
})
export class ActionsModule {}
