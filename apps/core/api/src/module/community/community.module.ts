import { ContentAggregateRoot } from "@cocrepo/aggregate";
import { ContentsRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import {
	CommunityCommandHandlers,
	CommunityQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { CommunityController } from "./community.controller";

@Module({
	imports: [CqrsModule],
	controllers: [CommunityController],
	providers: [
		ContentAggregateRoot,
		ContentsRepository,
		AuthContext,
		SpaceContext,
		...CommunityCommandHandlers,
		...CommunityQueryHandlers,
	],
})
export class CommunityModule {}
