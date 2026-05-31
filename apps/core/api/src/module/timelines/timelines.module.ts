import { TimelineAggregateRoot } from "@cocrepo/aggregate";
import { RoutinesRepository, TimelinesRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import {
	TimelineCommandHandlers,
	TimelineQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TimelinesController } from "./timelines.controller";

@Module({
	imports: [CqrsModule],
	controllers: [TimelinesController],
	providers: [
		TimelineAggregateRoot,
		TimelinesRepository,
		RoutinesRepository,
		AuthContext,
		SpaceContext,
		...TimelineCommandHandlers,
		...TimelineQueryHandlers,
	],
})
export class TimelinesModule {}
