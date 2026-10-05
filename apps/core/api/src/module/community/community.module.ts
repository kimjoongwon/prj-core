import { ContentAggregate } from "@cocrepo/aggregate";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { CommunityController } from "@cocrepo/controller";
import { ContentsRepository } from "@cocrepo/repository";
import {
	CommunityCommandHandlers,
	CommunityQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [CommunityController],
	providers: [
		ContentAggregate,
		ContentsRepository,
		AuthContext,
		SpaceContext,
		...CommunityCommandHandlers,
		...CommunityQueryHandlers,
	],
})
export class CommunityModule {}
