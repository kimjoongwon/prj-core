import { Module } from "@nestjs/common";
import {
	TimelinesController,
	TimelinesRepository,
	TimelinesService,
} from "@shared";

@Module({
	controllers: [TimelinesController],
	providers: [TimelinesService, TimelinesRepository],
})
export class TimelinesModule {}
