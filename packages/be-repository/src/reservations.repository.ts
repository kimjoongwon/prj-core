import { type DomainData, Reservation } from "@cocrepo/entity";
import { Prisma, PrismaClient, ReservationStatus } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
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
		userSeq: bigint,
		idempotencyKey: string,
	): Promise<Reservation | null> {
		this.logger.debug(`예약 멱등성 조회: user=${userSeq}`);

		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				userSeq,
				idempotencyKey,
			},
			include: reservationInclude,
		});

		return result ? toDomainEntity(Reservation, result) : null;
	}

	async findByIdForUser(params: {
		reservationSeq: bigint;
		userSeq: bigint;
		spaceSeq: bigint;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				seq: params.reservationSeq,
				userSeq: params.userSeq,
				spaceSeq: params.spaceSeq,
				removedAt: null,
			},
			include: reservationInclude,
		});

		return result ? toDomainEntity(Reservation, result) : null;
	}

	async findActiveDuplicate(params: {
		userSeq: bigint;
		programSeq: bigint;
		occurrenceStartAt: Date;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				userSeq: params.userSeq,
				programSeq: params.programSeq,
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
		spaceSeq: bigint;
		timelineSeq: bigint;
		sessionSeq: bigint;
		programSeq: bigint;
	}): Promise<BookingProgramRecord | null> {
		const result = await this.txHost.tx.program.findFirst({
			where: {
				seq: params.programSeq,
				session: {
					seq: params.sessionSeq,
					timeline: {
						seq: params.timelineSeq,
						spaceSeq: params.spaceSeq,
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
		spaceSeq: bigint;
		from: Date;
		to: Date;
		timelineSeq?: bigint;
		programSeq?: bigint;
		search?: string;
		skip?: number;
		take?: number;
	}): Promise<BookingProgramRecord[]> {
		const results = await this.txHost.tx.program.findMany({
			where: {
				...(params.programSeq ? { seq: params.programSeq } : {}),
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
						...(params.timelineSeq ? { seq: params.timelineSeq } : {}),
						spaceSeq: params.spaceSeq,
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

	async findCoachNames(instructorIds: bigint[]): Promise<Map<bigint, string>> {
		if (instructorIds.length === 0) {
			return new Map();
		}

		const users = await this.txHost.tx.user.findMany({
			where: { seq: { in: Array.from(new Set(instructorIds)) } },
			select: { seq: true, name: true },
		});

		return new Map(users.map((user) => [user.seq, user.name]));
	}

	async findReservationsForFeed(params: {
		spaceSeq: bigint;
		userSeq: bigint;
		from: Date;
		to: Date;
		programIds: bigint[];
	}): Promise<Reservation[]> {
		if (params.programIds.length === 0) {
			return [];
		}

		const result = await this.txHost.tx.reservation.findMany({
			where: {
				spaceSeq: params.spaceSeq,
				programSeq: { in: params.programIds },
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
		spaceSeq: bigint;
		userSeq: bigint;
		from?: Date;
		to?: Date;
		status?: ReservationStatus;
		skip?: number;
		take?: number;
	}): Promise<{ items: Reservation[]; totalCount: number }> {
		const where: Prisma.ReservationWhereInput = {
			spaceSeq: params.spaceSeq,
			userSeq: params.userSeq,
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
		programSeq: bigint;
		occurrenceStartAt: Date;
		status: ReservationStatus;
	}): Promise<number> {
		return this.txHost.tx.reservation.count({
			where: {
				programSeq: params.programSeq,
				occurrenceStartAt: params.occurrenceStartAt,
				status: params.status,
				removedAt: null,
			},
		});
	}

	async getMaxWaitlistPosition(params: {
		programSeq: bigint;
		occurrenceStartAt: Date;
	}): Promise<number> {
		const aggregate = await this.txHost.tx.reservation.aggregate({
			where: {
				programSeq: params.programSeq,
				occurrenceStartAt: params.occurrenceStartAt,
				status: ReservationStatus.WAITLISTED,
				removedAt: null,
			},
			_max: { waitlistPosition: true },
		});

		return aggregate._max.waitlistPosition ?? 0;
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.ReservationUncheckedCreateInput,
			"id"
		>,
	): Promise<Reservation> {
		const result = await this.txHost.tx.reservation.create({
			data,
			include: reservationInclude,
		});

		return toDomainEntity(Reservation, result);
	}

	async updateById(
		id: string,
		data: AutoIdentityUpdateInput<
			Prisma.ReservationUncheckedUpdateInput,
			"id"
		>,
	): Promise<Reservation> {
		const result = await this.txHost.tx.reservation.update({
			where: { id },
			data,
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
		programSeq: bigint;
		occurrenceStartAt: Date;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				programSeq: params.programSeq,
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
