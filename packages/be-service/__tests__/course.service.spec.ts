import type { SpaceContext } from "@cocrepo/context";
import type { Course } from "@cocrepo/entity";
import { CoursesRepository, TimelinesRepository } from "@cocrepo/repository";
import { BadRequestException } from "@nestjs/common";
import { CourseService } from "../src/course.service";

const spaceId = "11111111-1111-4111-8111-111111111111";
const courseId = "22222222-2222-4222-8222-222222222222";

describe("CourseService", () => {
	let service: CourseService;
	let coursesRepository: jest.Mocked<CoursesRepository>;
	let timelinesRepository: jest.Mocked<TimelinesRepository>;
	let spaceContext: SpaceContext;

	beforeEach(() => {
		coursesRepository = {
			create: jest.fn(),
			findByIdWithRelations: jest.fn(),
			findManyOfferings: jest.fn(),
			removeById: jest.fn(),
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

		service = new CourseService(
			coursesRepository,
			timelinesRepository,
			spaceContext,
		);
	});

	it("선택된 Space에 Course를 생성한다", async () => {
		const course = buildCourse();
		coursesRepository.create.mockResolvedValue(course);

		const result = await service.createCourse({
			spaceId,
			name: "초급 필라테스",
			durationMonths: 6,
			basePriceAmount: 450000,
			currency: "KRW",
			status: "ACTIVE",
		});

		expect(result).toBe(course);
		expect(coursesRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				spaceId,
				name: "초급 필라테스",
				durationMonths: 6,
				basePriceAmount: 450000,
			}),
		);
	});

	it("활성 Enrollment가 있는 Course 삭제를 거부한다", async () => {
		coursesRepository.findByIdWithRelations.mockResolvedValue(
			buildCourse({ activeEnrollmentCount: 1 }),
		);

		await expect(service.deleteCourse(courseId)).rejects.toThrow(
			BadRequestException,
		);
		expect(coursesRepository.removeById).not.toHaveBeenCalled();
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

function buildCourse(input: Partial<Course> = {}): Course {
	return {
		id: courseId,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		spaceId,
		name: "초급 필라테스",
		description: null,
		durationMonths: 6,
		basePriceAmount: 450000,
		currency: "KRW",
		status: "ACTIVE",
		activeOfferingCount: 0,
		activeEnrollmentCount: input.activeEnrollmentCount ?? 0,
		isActive: () => true,
		isDraft: () => false,
		isArchived: () => false,
		hasActiveOfferings: () => false,
		hasActiveEnrollments: () => (input.activeEnrollmentCount ?? 0) > 0,
		...input,
	} as Course;
}
