jest.mock("@nestjs-cls/transactional", () => ({
	Transactional:
		() =>
		(_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) =>
			descriptor,
}));

import { Reservation } from "@cocrepo/entity";
import { ReservationStatus, SessionTypes } from "@cocrepo/prisma";
import {
	type BookingProgramRecord,
	ReservationsRepository,
	TenantsRepository,
} from "@cocrepo/repository";
import { BadRequestException, ConflictException } from "@nestjs/common";
import { ReservationAggregate } from "../src/reservation/reservation.aggregate";

const spaceSeq = 101n;
const tenantId = 606n;
const userSeq = 202n;
const timelineSeq = 303n;
const sessionSeq = 404n;
const programSeq = 505n;
const occurrenceStartAt = new Date("2026-06-01T10:00:00.000Z");

describe("ReservationAggregate", () => {
	let service: ReservationAggregate;
	let repository: jest.Mocked<ReservationsRepository>;
	let tenantsRepository: jest.Mocked<TenantsRepository>;

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

		service = new ReservationAggregate(repository, tenantsRepository);
		tenantsRepository.findActiveByUserIdAndSpaceId.mockResolvedValue({
			id: tenantId,
		} as unknown as Awaited<
			ReturnType<TenantsRepository["findActiveByUserIdAndSpaceId"]>
		>);
		repository.findByUserAndIdempotencyKey.mockResolvedValue(null);
		repository.findBookingProgram.mockResolvedValue(
			buildProgram({ capacity: 2 }),
		);
		repository.findActiveDuplicate.mockResolvedValue(null);
		repository.countByProgramOccurrence.mockResolvedValue(1);
	});

	it("정원이 남아 있으면 CONFIRMED 예약을 생성한다", async () => {
		repository.create.mockImplementation(async (data) =>
			buildReservation({
				status: data.status as ReservationStatus,
				waitlistPosition: data.waitlistPosition as number | null,
			}),
		);

		const result = await service.create({
			spaceSeq,
			userSeq,
			input: buildCreateInput("idem-confirmed"),
		});

		expect(result.status).toBe(ReservationStatus.CONFIRMED);
		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				spaceSeq,
				createdBySeq: userSeq,
				userSeq,
				timelineSeq,
				sessionSeq,
				programSeq,
				status: ReservationStatus.CONFIRMED,
				waitlistPosition: null,
				idempotencyKey: "idem-confirmed",
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
			spaceSeq,
			userSeq,
			input: buildCreateInput("idem-waitlisted"),
		});

		expect(result.status).toBe(ReservationStatus.WAITLISTED);
		expect(result.waitlistPosition).toBe(4);
		expect(repository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				status: ReservationStatus.WAITLISTED,
				waitlistPosition: 4,
			}),
		);
	});

	it("동일 idempotencyKey 요청은 기존 예약을 반환한다", async () => {
		const existing = buildReservation({ status: ReservationStatus.CONFIRMED });
		repository.findByUserAndIdempotencyKey.mockResolvedValue(existing);

		const result = await service.create({
			spaceSeq,
			userSeq,
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
				spaceSeq,
				userSeq,
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
			id: 666n,
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
			spaceSeq,
			userSeq,
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
	});

	it("CONFIRMED 예약의 2시간 취소 cutoff 이후 취소는 400을 반환한다", async () => {
		repository.findByIdForUser.mockResolvedValue(
			buildReservation({ status: ReservationStatus.CONFIRMED }),
		);

		await expect(
			service.cancel({
				spaceSeq,
				userSeq,
				reservationId: 777n,
				now: new Date("2026-06-01T08:00:00.000Z"),
			}),
		).rejects.toThrow(BadRequestException);
		expect(repository.save).not.toHaveBeenCalled();
	});
});

function buildCreateInput(idempotencyKey: string) {
	return {
		timelineSeq,
		sessionSeq,
		programSeq,
		occurrenceStartAt,
		idempotencyKey,
		memo: null,
	};
}

function buildProgram(input: { capacity: number }): BookingProgramRecord {
	return {
		id: programSeq,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		routineSeq: 808n,
		sessionSeq,
		instructorSeq: 909n,
		capacity: input.capacity,
		name: "Morning Flow",
		level: "BEGINNER",
		routineNameSnapshot: "Flow",
		routineLabelSnapshot: "Flow Label",
		session: {
			id: sessionSeq,
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: null,
			removedAt: null,
			type: SessionTypes.ONE_TIME,
			repeatCycleType: null,
			startDateTime: occurrenceStartAt,
			endDateTime: new Date("2026-06-01T11:00:00.000Z"),
			recurringDayOfWeek: null,
			timelineSeq,
			name: "10AM",
			description: null,
			timeline: {
				id: timelineSeq,
				createdAt: new Date("2026-01-01T00:00:00.000Z"),
				updatedAt: null,
				removedAt: null,
				spaceSeq,
				createdBySeq: null,
				name: "June",
				description: null,
			},
		},
		programActivities: [],
	} as unknown as BookingProgramRecord;
}

function buildReservation(input: Record<string, unknown> = {}): Reservation {
	return Object.assign(new Reservation(), {
		id: input.id ?? 1111n,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		spaceSeq,
		createdBySeq: input.createdBySeq === undefined ? userSeq : input.createdBySeq,
		userSeq,
		timelineSeq,
		sessionSeq,
		programSeq,
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
