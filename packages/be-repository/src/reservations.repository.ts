import { type DomainData, Reservation } from "@cocrepo/entity";
import { Prisma, PrismaClient, ReservationStatus } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	PublicIdCreateInput,
	PublicIdUpdateInput,
} from "./public-id-input.type";
import { toDomainData, toDomainEntity } from "./to-domain-entity";

const reservationInclude = {
	space: true,
	createdBy: true,
	user: true,
	timeline: true,
	session: true,
	program: true,
} satisfies Prisma.ReservationInclude;

const bookingProgramInclude = {
	routine: { select: { id: true } },
	session: {
		include: {
			timeline: {
				include: {
					space: { select: { id: true } },
					createdBy: { select: { id: true } },
				},
			},
		},
	},
	programActivities: {
		where: { removedAt: null },
		select: {
			exerciseName: true,
			order: true,
		},
		orderBy: { order: "asc" },
	},
} satisfies Prisma.ProgramInclude;

type BookingProgramPersistenceRecord = Prisma.ProgramGetPayload<{
	include: typeof bookingProgramInclude;
}>;
export type BookingProgramRecord = DomainData<BookingProgramPersistenceRecord>;

@Injectable()
export class ReservationsRepository {
	private readonly logger = new Logger(ReservationsRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findByUserAndIdempotencyKey(
		userId: string,
		idempotencyKey: string,
	): Promise<Reservation | null> {
		this.logger.debug(`예약 멱등성 조회: user=${userId.slice(-8)}`);

		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				user: { id: userId },
				idempotencyKey,
			},
			include: reservationInclude,
		});

		return result ? toDomainEntity(Reservation, result) : null;
	}

	async findByIdForUser(params: {
		reservationId: string;
		userId: string;
		spaceId: string;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				id: params.reservationId,
				user: { id: params.userId },
				space: { id: params.spaceId },
				removedAt: null,
			},
			include: reservationInclude,
		});

		return result ? toDomainEntity(Reservation, result) : null;
	}

	async findActiveDuplicate(params: {
		userId: string;
		programId: string;
		occurrenceStartAt: Date;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				user: { id: params.userId },
				program: { id: params.programId },
				occurrenceStartAt: params.occurrenceStartAt,
				status: {
					in: [ReservationStatus.CONFIRMED, ReservationStatus.WAITLISTED],
				},
				removedAt: null,
			},
			include: reservationInclude,
		});

		return result ? toDomainEntity(Reservation, result) : null;
	}

	async findBookingProgram(params: {
		spaceId: string;
		timelineId: string;
		sessionId: string;
		programId: string;
	}): Promise<BookingProgramRecord | null> {
		const result = await this.txHost.tx.program.findFirst({
			where: {
				id: params.programId,
				session: {
					id: params.sessionId,
					timeline: {
						id: params.timelineId,
						space: { id: params.spaceId },
						removedAt: null,
					},
					removedAt: null,
				},
				removedAt: null,
			},
			include: bookingProgramInclude,
		});
		return result ? toDomainData(result) : null;
	}

	async findBookingPrograms(params: {
		spaceId: string;
		from: Date;
		to: Date;
		timelineId?: string;
		programId?: string;
		search?: string;
		skip?: number;
		take?: number;
	}): Promise<BookingProgramRecord[]> {
		const results = await this.txHost.tx.program.findMany({
			where: {
				...(params.programId ? { id: params.programId } : {}),
				...(params.search
					? {
							OR: [
								{ name: { contains: params.search, mode: "insensitive" } },
								{
									session: {
										name: { contains: params.search, mode: "insensitive" },
									},
								},
								{
									session: {
										timeline: {
											name: { contains: params.search, mode: "insensitive" },
										},
									},
								},
							],
						}
					: {}),
				removedAt: null,
				session: {
					removedAt: null,
					timeline: {
						...(params.timelineId ? { id: params.timelineId } : {}),
						space: { id: params.spaceId },
						removedAt: null,
					},
					OR: [
						{
							startDateTime: {
								gte: params.from,
								lte: params.to,
							},
						},
						{
							type: "RECURRING",
							startDateTime: { not: null },
						},
					],
				},
			},
			include: bookingProgramInclude,
			orderBy: [{ session: { startDateTime: "asc" } }, { createdAt: "asc" }],
			skip: params.skip,
			take: params.take,
		});
		return toDomainData(results);
	}

	async findCoachNames(instructorIds: string[]): Promise<Map<string, string>> {
		if (instructorIds.length === 0) {
			return new Map();
		}

		const users = await this.txHost.tx.user.findMany({
			where: { id: { in: Array.from(new Set(instructorIds)) } },
			select: { id: true, name: true },
		});

		return new Map(users.map((user) => [user.id, user.name]));
	}

	async findReservationsForFeed(params: {
		spaceId: string;
		userId: string;
		from: Date;
		to: Date;
		programIds: string[];
	}): Promise<Reservation[]> {
		if (params.programIds.length === 0) {
			return [];
		}

		const result = await this.txHost.tx.reservation.findMany({
			where: {
				space: { id: params.spaceId },
				program: { id: { in: params.programIds } },
				occurrenceStartAt: {
					gte: params.from,
					lte: params.to,
				},
				removedAt: null,
			},
			include: reservationInclude,
			orderBy: [{ occurrenceStartAt: "asc" }, { createdAt: "asc" }],
		});

		return result.map((item) => toDomainEntity(Reservation, item));
	}

	async findMine(params: {
		spaceId: string;
		userId: string;
		from?: Date;
		to?: Date;
		status?: ReservationStatus;
		skip?: number;
		take?: number;
	}): Promise<{ items: Reservation[]; totalCount: number }> {
		const where: Prisma.ReservationWhereInput = {
			space: { id: params.spaceId },
			user: { id: params.userId },
			removedAt: null,
			...(params.status ? { status: params.status } : {}),
			...(params.from || params.to
				? {
						occurrenceStartAt: {
							...(params.from ? { gte: params.from } : {}),
							...(params.to ? { lte: params.to } : {}),
						},
					}
				: {}),
		};

		const [items, totalCount] = await Promise.all([
			this.txHost.tx.reservation.findMany({
				where,
				include: reservationInclude,
				orderBy: [{ occurrenceStartAt: "asc" }, { createdAt: "asc" }],
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.reservation.count({ where }),
		]);

		return {
			items: items.map((item) => toDomainEntity(Reservation, item)),
			totalCount,
		};
	}

	async countByProgramOccurrence(params: {
		programId: string;
		occurrenceStartAt: Date;
		status: ReservationStatus;
	}): Promise<number> {
		return this.txHost.tx.reservation.count({
			where: {
				program: { id: params.programId },
				occurrenceStartAt: params.occurrenceStartAt,
				status: params.status,
				removedAt: null,
			},
		});
	}

	async getMaxWaitlistPosition(params: {
		programId: string;
		occurrenceStartAt: Date;
	}): Promise<number> {
		const aggregate = await this.txHost.tx.reservation.aggregate({
			where: {
				program: { id: params.programId },
				occurrenceStartAt: params.occurrenceStartAt,
				status: ReservationStatus.WAITLISTED,
				removedAt: null,
			},
			_max: { waitlistPosition: true },
		});

		return aggregate._max.waitlistPosition ?? 0;
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.ReservationUncheckedCreateInput,
			"space" | "user" | "timeline" | "session" | "program",
			"createdBy"
		>,
	): Promise<Reservation> {
		const {
			spaceId,
			createdById,
			userId,
			timelineId,
			sessionId,
			programId,
			...reservationData
		} = data;
		const result = await this.txHost.tx.reservation.create({
			data: {
				...reservationData,
				space: { connect: { id: spaceId } },
				user: { connect: { id: userId } },
				timeline: { connect: { id: timelineId } },
				session: { connect: { id: sessionId } },
				program: { connect: { id: programId } },
				...(createdById ? { createdBy: { connect: { id: createdById } } } : {}),
			},
			include: reservationInclude,
		});

		return toDomainEntity(Reservation, result);
	}

	async updateById(
		id: string,
		data: PublicIdUpdateInput<
			Prisma.ReservationUncheckedUpdateInput,
			"space" | "user" | "timeline" | "session" | "program",
			"createdBy"
		>,
	): Promise<Reservation> {
		const {
			spaceId,
			createdById,
			userId,
			timelineId,
			sessionId,
			programId,
			...reservationData
		} = data;
		const result = await this.txHost.tx.reservation.update({
			where: { id },
			data: {
				...reservationData,
				...(spaceId !== undefined
					? { space: { connect: { id: spaceId } } }
					: {}),
				...(userId !== undefined ? { user: { connect: { id: userId } } } : {}),
				...(timelineId !== undefined
					? { timeline: { connect: { id: timelineId } } }
					: {}),
				...(sessionId !== undefined
					? { session: { connect: { id: sessionId } } }
					: {}),
				...(programId !== undefined
					? { program: { connect: { id: programId } } }
					: {}),
				...(createdById !== undefined
					? createdById === null
						? { createdBy: { disconnect: true } }
						: { createdBy: { connect: { id: createdById } } }
					: {}),
			},
			include: reservationInclude,
		});

		return toDomainEntity(Reservation, result);
	}

	async save(reservation: Reservation): Promise<Reservation> {
		const result = await this.txHost.tx.reservation.update({
			where: { id: reservation.id },
			data: {
				status: reservation.status,
				memo: reservation.memo,
				waitlistPosition: reservation.waitlistPosition,
				confirmedAt: reservation.confirmedAt,
				canceledAt: reservation.canceledAt,
				cancelReason: reservation.cancelReason,
			},
			include: reservationInclude,
		});

		return toDomainEntity(Reservation, result);
	}

	async findNextWaitlisted(params: {
		programId: string;
		occurrenceStartAt: Date;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				program: { id: params.programId },
				occurrenceStartAt: params.occurrenceStartAt,
				status: ReservationStatus.WAITLISTED,
				removedAt: null,
			},
			orderBy: [{ waitlistPosition: "asc" }, { createdAt: "asc" }],
			include: reservationInclude,
		});

		return result ? toDomainEntity(Reservation, result) : null;
	}
}
