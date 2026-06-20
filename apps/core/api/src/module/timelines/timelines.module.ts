import { TimelineAggregate } from "@cocrepo/aggregate";
import { TimelinesController } from "@cocrepo/controller";
import { RoutinesRepository, TimelinesRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import {
	TimelineCommandHandlers,
	TimelineQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
