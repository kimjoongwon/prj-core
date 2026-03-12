import { RoutinesApplicationService } from "@cocrepo/app";
import { RoutinesRepository } from "@cocrepo/repository";
import { AuthContext, RoutinesService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RoutinesController } from "./routines.controller";

@Module({
	controllers: [RoutinesController],
	providers: [
		RoutinesApplicationService,
		RoutinesService,
		RoutinesRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [RoutinesApplicationService],
})
export class RoutinesModule {}
