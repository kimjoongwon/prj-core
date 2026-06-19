import { ContentAggregateRoot } from "@cocrepo/aggregate";
import { CreateCommunityPostCommand } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateCommunityPostCommand)
export class CreateCommunityPostUseCase
	implements ICommandHandler<CreateCommunityPostCommand>
{
	constructor(
		private readonly contentService: ContentAggregateRoot,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(command: CreateCommunityPostCommand): Promise<unknown> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(COMMON_ERRORS.USER_NOT_FOUND);
		}
		const post = await this.contentService.createCommunityPost({
			spaceId,
			userId,
			dto: command.input,
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
