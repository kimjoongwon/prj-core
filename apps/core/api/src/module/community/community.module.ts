import { ContentAggregate } from "@cocrepo/aggregate";
import { CommunityController } from "@cocrepo/controller";
import { ContentsRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
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
