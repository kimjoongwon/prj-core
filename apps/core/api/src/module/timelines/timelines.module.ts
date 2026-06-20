import { TimelineAggregate } from "@cocrepo/aggregate";
import { RoutinesRepository, TimelinesRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import {
	TimelineCommandHandlers,
	TimelineQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TimelinesController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [TimelinesController],
	providers: [
		TimelineAggregate,
		TimelinesRepository,
		RoutinesRepository,
		AuthContext,
		SpaceContext,
		...TimelineCommandHandlers,
		...TimelineQueryHandlers,
	],
})
export class TimelinesModule {}
