import { TimelinesRepository } from "@cocrepo/repository";
import { TimelinesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TimelinesController } from "./timelines.controller";

@Module({
	controllers: [TimelinesController],
	providers: [
		// Services
		TimelinesService,
		// Repositories
		TimelinesRepository,
	],
	exports: [TimelinesService],
})
export class TimelinesModule {}
