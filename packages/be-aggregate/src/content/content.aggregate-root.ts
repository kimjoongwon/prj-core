import {
	type CommunityPostRecord,
	ContentsRepository,
} from "@cocrepo/repository";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Transactional } from "@nestjs-cls/transactional";
import type { CommunityPostCreateInput } from "./community-post-create.input";
import type { CommunityPostListInput } from "./community-post-list.input";

@Injectable()
export class ContentAggregateRoot {
	private readonly logger = new Logger(ContentAggregateRoot.name);

	constructor(private readonly repository: ContentsRepository) {}

	listCommunityPosts(
		input: CommunityPostListInput,
	): Promise<{ items: CommunityPostRecord[]; totalCount: number }> {
		this.logger.debug(`커뮤니티 게시글 목록 조회: ${input.spaceId.slice(-8)}`);

		return this.repository.findCommunityPostsBySpaceId({
			skip: input.skip,
			spaceId: input.spaceId,
			take: input.take,
		});
	}

	@Transactional()
	async createCommunityPost(
		input: CommunityPostCreateInput,
	): Promise<CommunityPostRecord> {
		const text = input.dto.text.trim();
		const title = input.dto.title?.trim() || null;

		if (!text) {
			throw new BadRequestException("게시글 본문을 입력해 주세요.");
		}

		return this.repository.createCommunityPost({
			spaceId: input.spaceId,
			text,
			title,
			userId: input.userId,
		});
	}
}
