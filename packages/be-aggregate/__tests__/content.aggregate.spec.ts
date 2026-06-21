jest.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) =>
			descriptor,
}));

import { ContentsRepository } from "@cocrepo/repository";
import { BadRequestException } from "@nestjs/common";
import { ContentAggregate } from "../src/content/content.aggregate";

const spaceId = "11111111-1111-4111-8111-111111111111";
const tenantId = "33333333-3333-4333-8333-333333333333";
const userId = "22222222-2222-4222-8222-222222222222";

describe("ContentAggregate", () => {
	let repository: jest.Mocked<ContentsRepository>;
	let service: ContentAggregate;

	beforeEach(() => {
		repository = {
			createCommunityPost: jest.fn(),
			findCommunityPostsBySpaceId: jest.fn(),
		} as unknown as jest.Mocked<ContentsRepository>;
		service = new ContentAggregate(repository);
	});

	it("현재 Space 기준 커뮤니티 게시글 목록을 조회한다", async () => {
		repository.findCommunityPostsBySpaceId.mockResolvedValue({
			items: [],
			totalCount: 0,
		});

		const result = await service.listCommunityPosts({
			skip: 0,
			spaceId,
			take: 20,
			userId,
		});

		expect(result.totalCount).toBe(0);
		expect(repository.findCommunityPostsBySpaceId).toHaveBeenCalledWith({
			skip: 0,
			spaceId,
			take: 20,
		});
	});

	it("작성 payload를 정리한 뒤 커뮤니티 게시글을 생성한다", async () => {
		const createdPost = {
			id: "content-1",
			text: "함께 운동해요.",
			title: "새 글",
		};
		repository.createCommunityPost.mockResolvedValue(createdPost as never);

		const result = await service.createCommunityPost({
			dto: {
				text: "  함께 운동해요.  ",
				title: "  새 글  ",
			},
			tenantId,
			userId,
		});

		expect(result).toBe(createdPost);
		expect(repository.createCommunityPost).toHaveBeenCalledWith({
			tenantId,
			text: "함께 운동해요.",
			title: "새 글",
			userId,
		});
	});

	it("본문이 비어 있으면 게시글을 생성하지 않는다", async () => {
		await expect(
			service.createCommunityPost({
				dto: {
					text: "   ",
				},
				tenantId,
				userId,
			}),
		).rejects.toThrow(BadRequestException);
		expect(repository.createCommunityPost).not.toHaveBeenCalled();
	});
});
