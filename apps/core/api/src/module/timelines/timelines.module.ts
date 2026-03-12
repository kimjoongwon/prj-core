import { TimelinesRepository } from "@cocrepo/repository";
import { TimelinesApplicationService } from "@cocrepo/app";
import { AuthContext, SpaceContext, TimelinesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TimelinesController } from "./timelines.controller";

@Module({
	controllers: [TimelinesController],
	providers: [
		TimelinesApplicationService,
		TimelinesService,
		TimelinesRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [TimelinesApplicationService],
})
export class TimelinesModule {}
