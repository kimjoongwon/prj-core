import type { SpaceContext } from "@cocrepo/context";
import { CoursesRepository, TimelinesRepository } from "@cocrepo/repository";
import { CourseAggregateRoot } from "../src/course/course.aggregate-root";

const spaceId = "11111111-1111-4111-8111-111111111111";

describe("CourseAggregateRoot", () => {
	let service: CourseAggregateRoot;
	let coursesRepository: jest.Mocked<CoursesRepository>;
	let timelinesRepository: jest.Mocked<TimelinesRepository>;
	let spaceContext: SpaceContext;

	beforeEach(() => {
		coursesRepository = {
			findManyOfferings: jest.fn(),
		} as unknown as jest.Mocked<CoursesRepository>;
		timelinesRepository = {
			findTimelineById: jest.fn(),
		} as unknown as jest.Mocked<TimelinesRepository>;
		spaceContext = {
			spaceId,
			spaceIds: [spaceId],
			canAccessSpace: jest.fn(
				(targetSpaceId: string) => targetSpaceId === spaceId,
			),
		} as unknown as SpaceContext;

		service = new CourseAggregateRoot(
			coursesRepository,
			timelinesRepository,
			spaceContext,
		);
	});

	it("CourseOffering 목록 조회를 접근 가능한 Space로 제한한다", async () => {
		coursesRepository.findManyOfferings.mockResolvedValue({
			items: [],
			totalCount: 0,
		});

		await service.findCourseOfferings({ skip: 0, take: 10 });

		expect(coursesRepository.findManyOfferings).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({
					spaceId: { in: [spaceId] },
				}),
				skip: 0,
				take: 10,
			}),
		);
	});
});
