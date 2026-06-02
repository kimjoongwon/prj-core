import { createHash } from "node:crypto";

import { timelineSeedData, userGroundMapping } from "../demo-data";
import type { PrismaClient } from "../generated/client/client";
import {
	CourseOfferingStatus,
	CoursePassKind,
	CoursePassStatus,
	CourseStatus,
	EnrollmentStatus,
	PaymentStatus,
	ReservationStatus,
	SessionTypes,
	TimelineProvisioningMode,
} from "../generated/client/enums";

const DEMO_YEAR = 2026;
const DEMO_MONTH = 5;
const DEMO_START_DAY = 17;
const DEMO_END_DAY = 31;
const DEMO_TIME_ZONE_LABEL = "Asia/Seoul";

interface DemoSlot {
	code: string;
	hour: number;
	minute: number;
	durationMinutes: number;
	name: string;
	capacity: number;
	level?: string;
}

const DEFAULT_WEEKDAY_SLOTS = [
	{
		code: "late-morning",
		hour: 10,
		minute: 0,
		durationMinutes: 50,
		name: "모닝 컨디셔닝",
		capacity: 16,
	},
	{
		code: "after-work",
		hour: 19,
		minute: 0,
		durationMinutes: 50,
		name: "애프터워크 스트렝스",
		capacity: 14,
	},
] as const satisfies readonly DemoSlot[];

const DEFAULT_WEEKEND_SLOTS = [
	{
		code: "weekend-am",
		hour: 11,
		minute: 0,
		durationMinutes: 55,
		name: "주말 베이스 빌드",
		capacity: 18,
	},
	{
		code: "weekend-pm",
		hour: 15,
		minute: 0,
		durationMinutes: 55,
		name: "주말 리커버리 플로우",
		capacity: 18,
	},
] as const satisfies readonly DemoSlot[];

const GWANGHWAMUN_WEEKDAY_SLOTS = [
	{
		code: "gwanghwamun-early-burn",
		hour: 6,
		minute: 30,
		durationMinutes: 45,
		name: "출근 전 얼리 버너",
		capacity: 18,
		level: "초급",
	},
	{
		code: "gwanghwamun-commute-strength",
		hour: 7,
		minute: 30,
		durationMinutes: 50,
		name: "광화문 커뮤트 스트렝스",
		capacity: 18,
		level: "중급",
	},
	{
		code: "gwanghwamun-core-reset",
		hour: 8,
		minute: 30,
		durationMinutes: 45,
		name: "오피스 코어 리셋",
		capacity: 16,
		level: "초급",
	},
	{
		code: "gwanghwamun-lunch-hiit",
		hour: 12,
		minute: 10,
		durationMinutes: 40,
		name: "런치 HIIT 익스프레스",
		capacity: 20,
		level: "중급",
	},
	{
		code: "gwanghwamun-afterwork-cardio",
		hour: 18,
		minute: 30,
		durationMinutes: 50,
		name: "퇴근길 카디오 블라스트",
		capacity: 20,
		level: "중급",
	},
	{
		code: "gwanghwamun-afterwork-strength",
		hour: 19,
		minute: 30,
		durationMinutes: 50,
		name: "애프터워크 스트렝스",
		capacity: 18,
		level: "중급",
	},
	{
		code: "gwanghwamun-night-recovery",
		hour: 20,
		minute: 30,
		durationMinutes: 45,
		name: "나이트 리커버리 플로우",
		capacity: 16,
		level: "초급",
	},
] as const satisfies readonly DemoSlot[];

const GWANGHWAMUN_WEEKEND_SLOTS = [
	{
		code: "gwanghwamun-weekend-start",
		hour: 8,
		minute: 30,
		durationMinutes: 50,
		name: "주말 모닝 스타터",
		capacity: 20,
		level: "초급",
	},
	{
		code: "gwanghwamun-weekend-team",
		hour: 10,
		minute: 0,
		durationMinutes: 55,
		name: "팀 트레이닝 서킷",
		capacity: 22,
		level: "중급",
	},
	{
		code: "gwanghwamun-weekend-power",
		hour: 11,
		minute: 30,
		durationMinutes: 55,
		name: "파워 엔듀런스",
		capacity: 18,
		level: "고급",
	},
	{
		code: "gwanghwamun-weekend-reset",
		hour: 14,
		minute: 0,
		durationMinutes: 50,
		name: "오후 리셋 컨디셔닝",
		capacity: 18,
		level: "초급",
	},
	{
		code: "gwanghwamun-weekend-flow",
		hour: 16,
		minute: 0,
		durationMinutes: 50,
		name: "주말 리커버리 플로우",
		capacity: 16,
		level: "초급",
	},
] as const satisfies readonly DemoSlot[];

function stableUuid(seedKey: string): string {
	const hex = createHash("md5").update(seedKey).digest("hex");
	const part1 = hex.slice(0, 8);
	const part2 = hex.slice(8, 12);
	const part3 = `4${hex.slice(13, 16)}`;
	const variantNibble = (
		(Number.parseInt(hex.slice(16, 17), 16) & 0x3) |
		0x8
	).toString(16);
	const part4 = `${variantNibble}${hex.slice(17, 20)}`;
	const part5 = hex.slice(20, 32);
	return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

function hashToInt(seedKey: string, modulo: number): number {
	const hex = createHash("sha1").update(seedKey).digest("hex");
	const value = Number.parseInt(hex.slice(0, 12), 16);
	return value % modulo;
}

function pad2(value: number): string {
	return value.toString().padStart(2, "0");
}

function createDateKey(day: number): string {
	return `${DEMO_YEAR}-${pad2(DEMO_MONTH)}-${pad2(day)}`;
}

function createSeoulDate(day: number, hour: number, minute: number): Date {
	return new Date(
		`${createDateKey(day)}T${pad2(hour)}:${pad2(minute)}:00+09:00`,
	);
}

function addMinutes(date: Date, minutes: number): Date {
	return new Date(date.getTime() + minutes * 60 * 1000);
}

function addDays(date: Date, days: number): Date {
	return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function getSeoulDayOfWeek(day: number): number {
	return createSeoulDate(day, 12, 0).getUTCDay();
}

function getSlotsForDay(groundName: string, day: number): readonly DemoSlot[] {
	const dayOfWeek = getSeoulDayOfWeek(day);
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

	if (groundName === "F45 광화문") {
		return isWeekend ? GWANGHWAMUN_WEEKEND_SLOTS : GWANGHWAMUN_WEEKDAY_SLOTS;
	}

	return isWeekend ? DEFAULT_WEEKEND_SLOTS : DEFAULT_WEEKDAY_SLOTS;
}

function selectTimelineSeedsByGround() {
	const result = new Map<string, (typeof timelineSeedData)[number]>();
	const priority = { recent: 0, mid: 1, archive: 2 } as const;

	for (const timeline of timelineSeedData) {
		const current = result.get(timeline.groundName);
		if (!current || priority[timeline.seasonTag] < priority[current.seasonTag]) {
			result.set(timeline.groundName, timeline);
		}
	}

	return [...result.values()];
}

async function ensureFallbackRoutine(params: {
	prisma: PrismaClient;
	spaceId: string;
	creatorId?: string | null;
	groundName: string;
}) {
	const routineId = stableUuid(`mobile-demo-routine:${params.groundName}`);
	return params.prisma.routine.upsert({
		where: { id: routineId },
		update: {
			spaceId: params.spaceId,
			creatorId: params.creatorId ?? null,
			name: "모바일 예약 데모 루틴",
			label: `${params.groundName} 모바일 데모`,
		},
		create: {
			id: routineId,
			spaceId: params.spaceId,
			creatorId: params.creatorId ?? null,
			name: "모바일 예약 데모 루틴",
			label: `${params.groundName} 모바일 데모`,
		},
		include: {
			activities: {
				include: { task: { include: { exercise: true } } },
				orderBy: { order: "asc" },
				where: { removedAt: null },
			},
		},
	});
}

async function findRoutineForProgram(params: {
	prisma: PrismaClient;
	spaceId: string;
	creatorId?: string | null;
	groundName: string;
	seedKey: string;
}) {
	const routines = await params.prisma.routine.findMany({
		where: {
			spaceId: params.spaceId,
			removedAt: null,
		},
		include: {
			activities: {
				include: { task: { include: { exercise: true } } },
				orderBy: { order: "asc" },
				where: { removedAt: null },
			},
		},
		orderBy: [{ name: "asc" }, { createdAt: "asc" }],
		take: 12,
	});

	if (routines.length === 0) {
		return ensureFallbackRoutine(params);
	}

	return routines[hashToInt(params.seedKey, routines.length)];
}

function getUsersForGround(groundName: string): string[] {
	return userGroundMapping
		.filter((mapping) => mapping.groundNames.includes(groundName))
		.map((mapping) => mapping.userEmail);
}

export async function createMobileReservationDemoData(
	prisma: PrismaClient,
): Promise<void> {
	console.log("\n========================================");
	console.log(
		`Mobile Reservation 데모 데이터 삽입 중... (${DEMO_YEAR}-${pad2(
			DEMO_MONTH,
		)}-${pad2(DEMO_START_DAY)} ~ ${DEMO_YEAR}-${pad2(DEMO_MONTH)}-${pad2(
			DEMO_END_DAY,
		)}, ${DEMO_TIME_ZONE_LABEL})`,
	);
	console.log("========================================");

	const timelineSeeds = selectTimelineSeedsByGround();
	const timelineIds = timelineSeeds.map((timeline) => timeline.id);
	const userEmails = [...new Set(userGroundMapping.map((mapping) => mapping.userEmail))];
	const demoStart = createSeoulDate(DEMO_START_DAY, 0, 0);
	const demoEnd = createSeoulDate(DEMO_END_DAY, 23, 59);
	const passExpiresAt = addDays(demoEnd, 30);
	const paidAt = addDays(demoStart, -7);

	const [timelines, users, fallbackInstructor] = await Promise.all([
		prisma.timeline.findMany({
			where: { id: { in: timelineIds }, removedAt: null },
			include: { space: { include: { ground: true } } },
		}),
		prisma.user.findMany({
			where: { email: { in: userEmails } },
			select: { id: true, email: true },
		}),
		prisma.user.findFirst({ select: { id: true }, where: { email: "admin@plate.com" } }),
	]);
	if (!fallbackInstructor) {
		throw new Error("모바일 예약 데모 seed에 필요한 admin@plate.com 사용자를 찾을 수 없습니다.");
	}
	const timelineById = new Map(timelines.map((timeline) => [timeline.id, timeline]));
	const userByEmail = new Map(users.map((user) => [user.email, user]));

	let courseCount = 0;
	let offeringCount = 0;
	let enrollmentCount = 0;
	let passCount = 0;
	let sessionCount = 0;
	let programCount = 0;
	let programActivityCount = 0;
	let reservationCount = 0;

	for (const timelineSeed of timelineSeeds) {
		const timeline = timelineById.get(timelineSeed.id);
		if (!timeline) {
			console.warn(
				`  - Timeline 누락으로 모바일 예약 데모 스킵: ${timelineSeed.name}`,
			);
			continue;
		}

		const groundName = timeline.space.ground?.name ?? timelineSeed.groundName;
		const courseId = stableUuid(`mobile-demo-course:${groundName}`);
		const offeringId = stableUuid(`mobile-demo-offering:${timeline.id}`);

		const existingCourse = await prisma.course.findUnique({
			where: { id: courseId },
		});
		await prisma.course.upsert({
			where: { id: courseId },
			update: {
				spaceId: timeline.spaceId,
				name: `${groundName} 모바일 예약 패스`,
				description: "모바일 예약 피드 검증을 위한 2026년 5월 데모 수강권",
				durationMonths: 1,
				basePriceAmount: 99000,
				currency: "KRW",
				status: CourseStatus.ACTIVE,
			},
			create: {
				id: courseId,
				spaceId: timeline.spaceId,
				name: `${groundName} 모바일 예약 패스`,
				description: "모바일 예약 피드 검증을 위한 2026년 5월 데모 수강권",
				durationMonths: 1,
				basePriceAmount: 99000,
				currency: "KRW",
				status: CourseStatus.ACTIVE,
			},
		});
		if (!existingCourse) courseCount++;

		const existingOffering = await prisma.courseOffering.findUnique({
			where: { id: offeringId },
		});
		await prisma.courseOffering.upsert({
			where: { id: offeringId },
			update: {
				courseId,
				spaceId: timeline.spaceId,
				timelineId: timeline.id,
				timelineProvisioningMode: TimelineProvisioningMode.SHARED,
				name: "2026년 5월 모바일 예약 오픈",
				startsAt: demoStart,
				endsAt: demoEnd,
				enrollmentStartsAt: paidAt,
				enrollmentEndsAt: demoEnd,
				capacity: 120,
				status: CourseOfferingStatus.ACTIVE,
			},
			create: {
				id: offeringId,
				courseId,
				spaceId: timeline.spaceId,
				timelineId: timeline.id,
				timelineProvisioningMode: TimelineProvisioningMode.SHARED,
				name: "2026년 5월 모바일 예약 오픈",
				startsAt: demoStart,
				endsAt: demoEnd,
				enrollmentStartsAt: paidAt,
				enrollmentEndsAt: demoEnd,
				capacity: 120,
				status: CourseOfferingStatus.ACTIVE,
			},
		});
		if (!existingOffering) offeringCount++;

		const sessionsForReservations: Array<{
			programId: string;
			sessionId: string;
			startsAt: Date;
		}> = [];

		for (let day = DEMO_START_DAY; day <= DEMO_END_DAY; day++) {
			for (const slot of getSlotsForDay(groundName, day)) {
				const dateKey = createDateKey(day);
				const sessionId = stableUuid(
					`mobile-demo-session:${timeline.id}:${dateKey}:${slot.code}`,
				);
				const startsAt = createSeoulDate(day, slot.hour, slot.minute);
				const endsAt = addMinutes(startsAt, slot.durationMinutes);
				const existingSession = await prisma.session.findUnique({
					where: { id: sessionId },
				});

				await prisma.session.upsert({
					where: { id: sessionId },
					update: {
						timelineId: timeline.id,
						type: SessionTypes.ONE_TIME,
						name: `${slot.name} ${dateKey}`,
						description: `${groundName} ${dateKey} 모바일 예약 데모 세션`,
						startDateTime: startsAt,
						endDateTime: endsAt,
						repeatCycleType: null,
						recurringDayOfWeek: null,
					},
					create: {
						id: sessionId,
						timelineId: timeline.id,
						type: SessionTypes.ONE_TIME,
						name: `${slot.name} ${dateKey}`,
						description: `${groundName} ${dateKey} 모바일 예약 데모 세션`,
						startDateTime: startsAt,
						endDateTime: endsAt,
						repeatCycleType: null,
						recurringDayOfWeek: null,
					},
				});
				if (!existingSession) sessionCount++;

				const routine = await findRoutineForProgram({
					prisma,
					spaceId: timeline.spaceId,
					creatorId: timeline.creatorId,
					groundName,
					seedKey: `${timeline.id}:${dateKey}:${slot.code}`,
				});
				const programId = stableUuid(
					`mobile-demo-program:${sessionId}:${routine.id}`,
				);
				const existingProgram = await prisma.program.findUnique({
					where: { id: programId },
				});

				await prisma.program.upsert({
					where: { id: programId },
					update: {
						routineId: routine.id,
						sessionId,
						instructorId: timeline.creatorId ?? fallbackInstructor.id,
						capacity: slot.capacity,
						name: `${slot.name} 프로그램`,
						level: slot.level ?? (slot.code.includes("after") ? "중급" : "초급"),
						routineNameSnapshot: routine.name,
						routineLabelSnapshot: routine.label,
					},
					create: {
						id: programId,
						routineId: routine.id,
						sessionId,
						instructorId: timeline.creatorId ?? fallbackInstructor.id,
						capacity: slot.capacity,
						name: `${slot.name} 프로그램`,
						level: slot.level ?? (slot.code.includes("after") ? "중급" : "초급"),
						routineNameSnapshot: routine.name,
						routineLabelSnapshot: routine.label,
					},
				});
				if (!existingProgram) programCount++;

				for (const activity of routine.activities.slice(0, 4)) {
					const programActivityId = stableUuid(
						`mobile-demo-program-activity:${programId}:${activity.taskId}`,
					);
					const existingProgramActivity =
						await prisma.programActivity.findUnique({
							where: { id: programActivityId },
						});
					await prisma.programActivity.upsert({
						where: { id: programActivityId },
						update: {
							programId,
							taskId: activity.taskId,
							order: activity.order,
							repetitions: activity.repetitions,
							restTime: activity.restTime,
							notes: activity.notes,
							exerciseName: activity.task.exercise?.name ?? "기본 서킷",
							exerciseDescription:
								activity.task.exercise?.description ?? "모바일 예약 데모 운동",
							exerciseDuration: activity.task.exercise?.duration ?? 50,
							exerciseCount: activity.task.exercise?.count ?? 10,
							imageFileId: activity.task.exercise?.imageFileId ?? null,
							videoFileId: activity.task.exercise?.videoFileId ?? null,
						},
						create: {
							id: programActivityId,
							programId,
							taskId: activity.taskId,
							order: activity.order,
							repetitions: activity.repetitions,
							restTime: activity.restTime,
							notes: activity.notes,
							exerciseName: activity.task.exercise?.name ?? "기본 서킷",
							exerciseDescription:
								activity.task.exercise?.description ?? "모바일 예약 데모 운동",
							exerciseDuration: activity.task.exercise?.duration ?? 50,
							exerciseCount: activity.task.exercise?.count ?? 10,
							imageFileId: activity.task.exercise?.imageFileId ?? null,
							videoFileId: activity.task.exercise?.videoFileId ?? null,
						},
					});
					if (!existingProgramActivity) programActivityCount++;
				}

				if (day <= DEMO_START_DAY + 4) {
					sessionsForReservations.push({ programId, sessionId, startsAt });
				}
			}
		}

		const enrolledUserEmails = getUsersForGround(groundName);
		const coursePassIds: string[] = [];

		for (const [userIndex, userEmail] of enrolledUserEmails.entries()) {
			const user = userByEmail.get(userEmail);
			if (!user) continue;

			const enrollmentId = stableUuid(
				`mobile-demo-enrollment:${user.id}:${offeringId}`,
			);
			const coursePassId = stableUuid(
				`mobile-demo-course-pass:${user.id}:${offeringId}`,
			);
			const existingEnrollment = await prisma.enrollment.findUnique({
				where: { id: enrollmentId },
			});

			await prisma.enrollment.upsert({
				where: { id: enrollmentId },
				update: {
					userId: user.id,
					courseId,
					courseOfferingId: offeringId,
					assignedTimelineId: timeline.id,
					paymentStatus: PaymentStatus.PAID,
					paidAt,
					paidAmount: 99000,
					currency: "KRW",
					validFrom: demoStart,
					validUntil: passExpiresAt,
					status: EnrollmentStatus.ACTIVE,
				},
				create: {
					id: enrollmentId,
					userId: user.id,
					courseId,
					courseOfferingId: offeringId,
					assignedTimelineId: timeline.id,
					paymentStatus: PaymentStatus.PAID,
					paidAt,
					paidAmount: 99000,
					currency: "KRW",
					validFrom: demoStart,
					validUntil: passExpiresAt,
					status: EnrollmentStatus.ACTIVE,
				},
			});
			if (!existingEnrollment) enrollmentCount++;

			const existingCoursePass = await prisma.coursePass.findUnique({
				where: { id: coursePassId },
			});
			await prisma.coursePass.upsert({
				where: { id: coursePassId },
				update: {
					enrollmentId,
					userId: user.id,
					courseId,
					courseOfferingId: offeringId,
					timelineId: timeline.id,
					kind: CoursePassKind.STANDARD,
					issuedAt: paidAt,
					validFrom: demoStart,
					expiresAt: passExpiresAt,
					reservationLimit: 20,
					status: CoursePassStatus.ACTIVE,
				},
				create: {
					id: coursePassId,
					enrollmentId,
					userId: user.id,
					courseId,
					courseOfferingId: offeringId,
					timelineId: timeline.id,
					kind: CoursePassKind.STANDARD,
					issuedAt: paidAt,
					validFrom: demoStart,
					expiresAt: passExpiresAt,
					reservationLimit: 20,
					reservationUsedCount: 0,
					reservationRemainingCount: 20,
					status: CoursePassStatus.ACTIVE,
				},
			});
			if (!existingCoursePass) passCount++;
			coursePassIds.push(coursePassId);

			const reservationTarget =
				sessionsForReservations[
					(userIndex * 2 + hashToInt(`${user.id}:${timeline.id}`, 3)) %
						sessionsForReservations.length
				];
			if (!reservationTarget) continue;

			const reservationId = stableUuid(
				`mobile-demo-reservation:${user.id}:${reservationTarget.programId}:${reservationTarget.startsAt.toISOString()}`,
			);
			const existingReservation = await prisma.reservation.findUnique({
				where: { id: reservationId },
			});
			await prisma.reservation.upsert({
				where: { id: reservationId },
				update: {
					spaceId: timeline.spaceId,
					userId: user.id,
					coursePassId,
					timelineId: timeline.id,
					sessionId: reservationTarget.sessionId,
					programId: reservationTarget.programId,
					occurrenceStartAt: reservationTarget.startsAt,
					status: ReservationStatus.CONFIRMED,
					memo: "모바일 데모 예약",
					idempotencyKey: `mobile-demo-${reservationId}`,
					waitlistPosition: null,
					confirmedAt: paidAt,
					canceledAt: null,
					cancelReason: null,
				},
				create: {
					id: reservationId,
					spaceId: timeline.spaceId,
					userId: user.id,
					coursePassId,
					timelineId: timeline.id,
					sessionId: reservationTarget.sessionId,
					programId: reservationTarget.programId,
					occurrenceStartAt: reservationTarget.startsAt,
					status: ReservationStatus.CONFIRMED,
					memo: "모바일 데모 예약",
					idempotencyKey: `mobile-demo-${reservationId}`,
					waitlistPosition: null,
					confirmedAt: paidAt,
					canceledAt: null,
					cancelReason: null,
				},
			});
			if (!existingReservation) reservationCount++;
		}

		await prisma.courseOffering.update({
			where: { id: offeringId },
			data: { enrolledCount: enrolledUserEmails.length },
		});

		for (const coursePassId of coursePassIds) {
			const usedCount = await prisma.reservation.count({
				where: {
					coursePassId,
					removedAt: null,
					status: {
						in: [ReservationStatus.CONFIRMED, ReservationStatus.WAITLISTED],
					},
				},
			});
			await prisma.coursePass.update({
				where: { id: coursePassId },
				data: {
					reservationUsedCount: usedCount,
					reservationRemainingCount: Math.max(20 - usedCount, 0),
				},
			});
		}
	}

	console.log(
		`✅ Mobile Reservation 데모 시드 완료! Course(${courseCount}), Offering(${offeringCount}), Enrollment(${enrollmentCount}), CoursePass(${passCount}), Session(${sessionCount}), Program(${programCount}), ProgramActivity(${programActivityCount}), Reservation(${reservationCount})`,
	);
}
