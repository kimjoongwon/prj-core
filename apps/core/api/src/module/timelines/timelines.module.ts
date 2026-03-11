import { TimelinesApplicationService } from "@cocrepo/app";
import { TimelinesRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext, TimelinesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TimelinesController } from "./timelines.controller";

@Module({
	controllers: [TimelinesController],
	providers: [
		TimelinesApplicationService,
		// Services
		TimelinesService,
		// Repositories
		TimelinesRepository,
		// Context
		AuthContext,
		SpaceContext,
	],
	exports: [TimelinesApplicationService],
})
export class TimelinesModule {}
