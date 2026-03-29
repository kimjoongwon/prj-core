import { TimelineFacade } from "@cocrepo/facade";
import { RoutinesRepository, TimelinesRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext, TimelineService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TimelinesController } from "./timelines.controller";

@Module({
	controllers: [TimelinesController],
	providers: [
		TimelineFacade,
		TimelineService,
		TimelinesRepository,
		RoutinesRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [TimelineFacade],
})
export class TimelinesModule {}
