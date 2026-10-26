import { ContentAggregate } from "@cocrepo/aggregate";
import { GetCommunityPostsQuery } from "@cocrepo/command";
import { COMMON_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { buildOffsetPaginationMeta } from "@cocrepo/toolkit";
import { UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";
import type { CommunityPostResult } from "./community-post.result";

@QueryHandler(GetCommunityPostsQuery)
export class GetCommunityPostsUseCase {
	constructor(
		private readonly contentService: ContentAggregate,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	async execute(query: GetCommunityPostsQuery): Promise<unknown> {
		const context = this.requireCommunityContext();
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
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

	private requireCommunityContext(): { spaceId: bigint; userId: bigint } {
		const spaceId = this.spaceContext.tenant?.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}
		const userId = this.authContext.userDto?.id;
		if (!userId) {
			throw new UnauthorizedException(COMMON_ERRORS.USER_NOT_FOUND);
		}
		return { spaceId, userId };
	}

	private toCommunityPostDto(
		record: Awaited<
			ReturnType<ContentAggregate["listCommunityPosts"]>
		>["items"][number],
	): CommunityPostResult {
		return {
			authorName: record.createdBy?.name ?? "회원",
			createdAt: record.createdAt,
			id: record.id,
			isMine: record.createdBy?.id === this.authContext.userDto?.id,
			isPinned: false,
			text: record.text ?? "",
			title: record.title ?? null,
		};
	}
}
