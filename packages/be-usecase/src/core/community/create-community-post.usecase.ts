import { ContentAggregate } from "@cocrepo/aggregate";
import { CreateCommunityPostCommand } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateCommunityPostCommand)
export class CreateCommunityPostUseCase {
	constructor(
		private readonly contentService: ContentAggregate,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(command: CreateCommunityPostCommand): Promise<unknown> {
		const tenantId = this.spaceContext.tenantId;
		if (!tenantId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(COMMON_ERRORS.USER_NOT_FOUND);
		}
		const post = await this.contentService.createCommunityPost({
			tenantId,
			userId,
			...command,
		});
		return {
			authorName: post.creator?.name ?? "회원",
			createdAt: post.createdAt,
			id: post.id,
			isMine: post.creator?.id === userId,
			isPinned: false,
			text: post.text ?? "",
			title: post.title ?? null,
		};
	}
}
