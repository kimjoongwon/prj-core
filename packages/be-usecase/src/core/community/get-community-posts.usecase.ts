import { ContentAggregateRoot } from "@cocrepo/aggregate";
import { GetCommunityPostsQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { CommunityPostDto } from "@cocrepo/dto";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { buildOffsetPaginationMeta } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetCommunityPostsQuery)
export class GetCommunityPostsUseCase
	implements IQueryHandler<GetCommunityPostsQuery>
{
	constructor(
		private readonly contentService: ContentAggregateRoot,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetCommunityPostsQuery): Promise<unknown> {
		const context = this.requireCommunityContext();
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 20;
		const result = await this.contentService.listCommunityPosts({
			...context,
			skip,
			take,
		});
		return {
			data: result.items.map((item) => this.toCommunityPostDto(item)),
			meta: buildOffsetPaginationMeta(result.totalCount, skip, take),
		};
	}

	private requireCommunityContext(): { spaceId: string; userId: string } {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(COMMON_ERRORS.USER_NOT_FOUND);
		}
		return { spaceId, userId };
	}

	private toCommunityPostDto(
		record: Awaited<
			ReturnType<ContentAggregateRoot["listCommunityPosts"]>
		>["items"][number],
	): CommunityPostDto {
		return {
			authorName: record.creator?.name ?? "회원",
			createdAt: record.createdAt,
			id: record.id,
			isMine: record.creator?.id === this.authContext.user?.id,
			isPinned: false,
			text: record.text ?? "",
			title: record.title ?? null,
		};
	}
}
