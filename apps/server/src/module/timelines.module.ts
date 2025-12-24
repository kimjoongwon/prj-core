import { TimelinesRepository } from "@cocrepo/repository";
import { TimelinesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TimelinesController } from "@shared";

@Module({
	controllers: [TimelinesController],
	providers: [TimelinesService, TimelinesRepository],
})
export class TimelinesModule {}
