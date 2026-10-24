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
		const spaceSeq = this.spaceContext.tenant?.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		const userSeq = this.authContext.userDto?.id;
		if (!userSeq) {
			throw new UnauthorizedException(COMMON_ERRORS.USER_NOT_FOUND);
		}
		const post = await this.contentService.createCommunityPost({
			spaceSeq,
			userSeq,
			...command,
		});
		return {
			authorName: post.createdBy?.name ?? "회원",
			createdAt: post.createdAt,
			id: post.id,
			isMine: post.createdBy?.id === userSeq,
			isPinned: false,
			text: post.text ?? "",
			title: post.title ?? null,
		};
	}
}
