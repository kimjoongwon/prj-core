jest.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) =>
			descriptor,
}));

import { type CoursePass, Reservation } from "@cocrepo/entity";
import {
	CoursePassStatus,
	ReservationStatus,
	SessionTypes,
} from "@cocrepo/prisma";
import {
	type BookingProgramRecord,
	CoursesRepository,
	ReservationsRepository,
	TenantsRepository,
} from "@cocrepo/repository";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { ReservationAggregate } from "../src/reservation/reservation.aggregate";

const spaceId = "11111111-1111-4111-8111-111111111111";
const tenantId = "66666666-6666-4666-8666-666666666666";
const userId = "22222222-2222-4222-8222-222222222222";
const timelineId = "33333333-3333-4333-8333-333333333333";
const sessionId = "44444444-4444-4444-8444-444444444444";
const programId = "55555555-5555-4555-8555-555555555555";
const coursePassId = "12121212-1212-4121-8121-121212121212";
const occurrenceStartAt = new Date("2026-06-01T10:00:00.000Z");

describe("ReservationAggregate", () => {
	let service: ReservationAggregate;
	let repository: jest.Mocked<ReservationsRepository>;
	let tenantsRepository: jest.Mocked<TenantsRepository>;
	let coursesRepository: jest.Mocked<CoursesRepository>;

	beforeEach(() => {
		repository = {
			findByUserAndIdempotencyKey: jest.fn(),
			findBookingProgram: jest.fn(),
			findActiveDuplicate: jest.fn(),
			countByProgramOccurrence: jest.fn(),
			getMaxWaitlistPosition: jest.fn(),
			create: jest.fn(),
			findByIdForUser: jest.fn(),
			save: jest.fn(),
			updateById: jest.fn(),
			findNextWaitlisted: jest.fn(),
		} as unknown as jest.Mocked<ReservationsRepository>;
		tenantsRepository = {
			findActiveByUserIdAndSpaceId: jest.fn(),
		} as unknown as jest.Mocked<TenantsRepository>;
		coursesRepository = {
			findCoursePassById: jest.fn(),
			updateCoursePassUsageById: jest.fn(),
		} as unknown as jest.Mocked<CoursesRepository>;

		service = new ReservationAggregate(
			repository,
			tenantsRepository,
			coursesRepository,
		);
		tenantsRepository.findActiveByUserIdAndSpaceId.mockResolvedValue({
			id: tenantId,
		} as Awaited<
			ReturnType<TenantsRepository["findActiveByUserIdAndSpaceId"]>
		>);
		repository.findByUserAndIdempotencyKey.mockResolvedValue(null);
		repository.findBookingProgram.mockResolvedValue(
			buildProgram({ capacity: 2 }),
		);
		repository.findActiveDuplicate.mockResolvedValue(null);
		repository.countByProgramOccurrence.mockResolvedValue(1);
		coursesRepository.findCoursePassById.mockResolvedValue(buildCoursePass());
		coursesRepository.updateCoursePassUsageById.mockResolvedValue(
			buildCoursePass(),
		);
	});

	it("정원이 남아 있으면 CONFIRMED 예약을 생성한다", async () => {
		repository.create.mockImplementation(async (data) =>
			buildReservation({
				status: data.status as ReservationStatus,
				waitlistPosition: data.waitlistPosition as number | null,
			}),
		);

		const result = await service.create({
			spaceId,
			userId,
			input: buildCreateInput("idem-confirmed"),
		});

		expect(result.status).toBe(ReservationStatus.CONFIRMED);
		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				spaceId,
				userId,
				timelineId,
				sessionId,
				programId,
				status: ReservationStatus.CONFIRMED,
				waitlistPosition: null,
				idempotencyKey: "idem-confirmed",
				coursePassId,
			}),
		);
		expect(coursesRepository.updateCoursePassUsageById).toHaveBeenCalledWith(
			coursePassId,
			expect.objectContaining({
				reservationUsedCount: { increment: 1 },
				reservationRemainingCount: { decrement: 1 },
			}),
		);
	});

	it("정원이 가득 차면 WAITLISTED 예약과 다음 대기 순번을 생성한다", async () => {
		repository.countByProgramOccurrence.mockResolvedValue(2);
		repository.getMaxWaitlistPosition.mockResolvedValue(3);
		repository.create.mockImplementation(async (data) =>
			buildReservation({
				status: data.status as ReservationStatus,
				waitlistPosition: data.waitlistPosition as number | null,
			}),
		);

		const result = await service.create({
			spaceId,
			userId,
			input: buildCreateInput("idem-waitlisted"),
		});

		expect(result.status).toBe(ReservationStatus.WAITLISTED);
		expect(result.waitlistPosition).toBe(4);
		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				status: ReservationStatus.WAITLISTED,
				waitlistPosition: 4,
				coursePassId,
			}),
		);
		expect(coursesRepository.updateCoursePassUsageById).not.toHaveBeenCalled();
	});

	it("동일 idempotencyKey 요청은 기존 예약을 반환한다", async () => {
		const existing = buildReservation({ status: ReservationStatus.CONFIRMED });
		repository.findByUserAndIdempotencyKey.mockResolvedValue(existing);

		const result = await service.create({
			spaceId,
			userId,
			input: buildCreateInput("idem-existing"),
		});

		expect(result).toBe(existing);
		expect(repository.findBookingProgram).not.toHaveBeenCalled();
		expect(repository.create).not.toHaveBeenCalled();
	});

	it("활성 중복 예약은 409를 반환한다", async () => {
		repository.findActiveDuplicate.mockResolvedValue(
			buildReservation({ status: ReservationStatus.CONFIRMED }),
		);

		await expect(
			service.create({
				spaceId,
				userId,
				input: buildCreateInput("idem-duplicate"),
			}),
		).rejects.toThrow(ConflictException);
		expect(repository.create).not.toHaveBeenCalled();
	});

	it("CONFIRMED 취소 시 다음 WAITLISTED 예약을 승격한다", async () => {
		const reservation = buildReservation({
			status: ReservationStatus.CONFIRMED,
		});
		const nextWaitlisted = buildReservation({
			id: "66666666-6666-4666-8666-666666666666",
			status: ReservationStatus.WAITLISTED,
			waitlistPosition: 1,
		});
		const now = new Date("2026-06-01T07:00:00.000Z");

		repository.findByIdForUser.mockResolvedValue(reservation);
		repository.save.mockImplementation(async (nextReservation) =>
			buildReservation({
				id: nextReservation.id,
				status: nextReservation.status,
				waitlistPosition: nextReservation.waitlistPosition,
				canceledAt: nextReservation.canceledAt,
				cancelReason: nextReservation.cancelReason,
			}),
		);
		repository.findNextWaitlisted.mockResolvedValue(nextWaitlisted);

		await service.cancel({
			spaceId,
			userId,
			reservationId: reservation.id,
			cancelReason: "일정 변경",
			now,
		});

		expect(repository.save).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				id: reservation.id,
				status: ReservationStatus.CANCELED,
				canceledAt: now,
				cancelReason: "일정 변경",
			}),
		);
		expect(repository.save).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				id: nextWaitlisted.id,
				status: ReservationStatus.CONFIRMED,
				waitlistPosition: null,
				confirmedAt: now,
			}),
		);
		expect(coursesRepository.updateCoursePassUsageById).toHaveBeenNthCalledWith(
			1,
			coursePassId,
			expect.objectContaining({
				reservationUsedCount: { decrement: 1 },
				reservationRemainingCount: { increment: 1 },
			}),
		);
		expect(coursesRepository.updateCoursePassUsageById).toHaveBeenNthCalledWith(
			2,
			coursePassId,
			expect.objectContaining({
				reservationUsedCount: { increment: 1 },
				reservationRemainingCount: { decrement: 1 },
			}),
		);
	});

	it("CONFIRMED 예약의 2시간 취소 cutoff 이후 취소는 400을 반환한다", async () => {
		repository.findByIdForUser.mockResolvedValue(
			buildReservation({ status: ReservationStatus.CONFIRMED }),
		);

		await expect(
			service.cancel({
				spaceId,
				userId,
				reservationId: "77777777-7777-4777-8777-777777777777",
				now: new Date("2026-06-01T08:00:00.000Z"),
			}),
		).rejects.toThrow(BadRequestException);
		expect(repository.save).not.toHaveBeenCalled();
	});
});

function buildCreateInput(idempotencyKey: string) {
	return {
		timelineId,
		sessionId,
		programId,
		occurrenceStartAt,
		coursePassId,
		idempotencyKey,
		memo: null,
	};
}

function buildCoursePass(): CoursePass {
	return {
		id: coursePassId,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		enrollmentId: "13131313-1313-4131-8131-131313131313",
		userId,
		courseId: "14141414-1414-4141-8141-141414141414",
		courseOfferingId: "15151515-1515-4151-8151-151515151515",
		timelineId,
		kind: "STANDARD",
		issuedAt: new Date("2026-05-01T00:00:00.000Z"),
		validFrom: new Date("2026-05-01T00:00:00.000Z"),
		expiresAt: new Date("2026-10-31T00:00:00.000Z"),
		reservationLimit: 48,
		reservationUsedCount: 0,
		reservationRemainingCount: 48,
		status: CoursePassStatus.ACTIVE,
		courseOffering: {
			tenantId,
			tenant: { id: tenantId, spaceId },
		},
		course: {
			tenantId,
			tenant: { id: tenantId, spaceId },
		},
	} as unknown as CoursePass;
}

function buildProgram(input: { capacity: number }): BookingProgramRecord {
	return {
		id: programId,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		routineId: "88888888-8888-4888-8888-888888888888",
		sessionId,
		instructorId: "99999999-9999-4999-8999-999999999999",
		capacity: input.capacity,
		name: "Morning Flow",
		level: "BEGINNER",
		routineNameSnapshot: "Flow",
		routineLabelSnapshot: "Flow Label",
		session: {
			id: sessionId,
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			type: SessionTypes.ONE_TIME,
			repeatCycleType: null,
			startDateTime: occurrenceStartAt,
			endDateTime: new Date("2026-06-01T11:00:00.000Z"),
			recurringDayOfWeek: null,
			timelineId,
			name: "10AM",
			description: null,
			timeline: {
				id: timelineId,
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
				updatedAt: null,
				removedAt: null,
				tenantId,
				creatorId: null,
				name: "June",
				description: null,
			},
		},
		programActivities: [],
	} as unknown as BookingProgramRecord;
}

function buildReservation(input: Partial<Reservation> = {}): Reservation {
	return Object.assign(new Reservation(), {
		id: input.id ?? "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		tenantId,
		tenant: { id: tenantId, spaceId },
		userId,
		coursePassId,
		timelineId,
		sessionId,
		programId,
		occurrenceStartAt,
		status: input.status ?? ReservationStatus.CONFIRMED,
		memo: null,
		idempotencyKey: "idem-key",
		waitlistPosition: input.waitlistPosition ?? null,
		confirmedAt: input.confirmedAt ?? null,
		canceledAt: input.canceledAt ?? null,
		cancelReason: input.cancelReason ?? null,
	});
}
