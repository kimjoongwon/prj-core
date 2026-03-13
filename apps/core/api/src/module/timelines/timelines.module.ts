import { TimelinesRepository } from "@cocrepo/repository";
import { TimelineFacade } from "@cocrepo/facade";
import { AuthContext, SpaceContext, TimelineService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TimelinesController } from "./timelines.controller";

@Module({
	controllers: [TimelinesController],
	providers: [
		TimelineFacade,
		TimelineService,
		TimelinesRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [TimelineFacade],
})
export class TimelinesModule {}
