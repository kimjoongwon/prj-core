import { Reservation } from "@cocrepo/entity";
import { Prisma, PrismaClient, ReservationStatus } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

const reservationInclude = {
	tenant: true,
	user: true,
	coursePass: {
		include: {
			course: true,
			courseOffering: {
				include: {
					tenant: true,
					timeline: true,
				},
			},
			timeline: true,
		},
	},
	timeline: true,
	session: true,
	program: true,
} satisfies Prisma.ReservationInclude;

const bookingProgramInclude = {
	session: {
		include: {
			timeline: true,
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

export type BookingProgramRecord = Prisma.ProgramGetPayload<{
	include: typeof bookingProgramInclude;
}>;

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

		const result = await this.txHost.tx.reservation.findUnique({
			where: { userId_idempotencyKey: { userId, idempotencyKey } },
			include: reservationInclude,
		});

		return result ? plainToInstance(Reservation, result) : null;
	}

	async findByIdForUser(params: {
		reservationId: string;
		userId: string;
		spaceId: string;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				id: params.reservationId,
				userId: params.userId,
				tenant: { spaceId: params.spaceId },
				removedAt: null,
			},
			include: reservationInclude,
		});

		return result ? plainToInstance(Reservation, result) : null;
	}

	async findActiveDuplicate(params: {
		userId: string;
		programId: string;
		occurrenceStartAt: Date;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				userId: params.userId,
				programId: params.programId,
				occurrenceStartAt: params.occurrenceStartAt,
				status: {
					in: [ReservationStatus.CONFIRMED, ReservationStatus.WAITLISTED],
				},
				removedAt: null,
			},
			include: reservationInclude,
		});

		return result ? plainToInstance(Reservation, result) : null;
	}

	async findBookingProgram(params: {
		spaceId: string;
		timelineId: string;
		sessionId: string;
		programId: string;
	}): Promise<BookingProgramRecord | null> {
		return this.txHost.tx.program.findFirst({
			where: {
				id: params.programId,
				sessionId: params.sessionId,
				removedAt: null,
				session: {
					id: params.sessionId,
					timelineId: params.timelineId,
					removedAt: null,
					timeline: {
						id: params.timelineId,
						tenant: { spaceId: params.spaceId },
						removedAt: null,
					},
				},
			},
			include: bookingProgramInclude,
		});
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
		return this.txHost.tx.program.findMany({
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
					...(params.timelineId ? { timelineId: params.timelineId } : {}),
					timeline: {
						tenant: { spaceId: params.spaceId },
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
				tenant: { spaceId: params.spaceId },
				programId: { in: params.programIds },
				occurrenceStartAt: {
					gte: params.from,
					lte: params.to,
				},
				removedAt: null,
			},
			orderBy: [{ occurrenceStartAt: "asc" }, { createdAt: "asc" }],
		});

		return result.map((item) => plainToInstance(Reservation, item));
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
			tenant: { spaceId: params.spaceId },
			userId: params.userId,
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
			items: items.map((item) => plainToInstance(Reservation, item)),
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
				programId: params.programId,
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
				programId: params.programId,
				occurrenceStartAt: params.occurrenceStartAt,
				status: ReservationStatus.WAITLISTED,
				removedAt: null,
			},
			_max: { waitlistPosition: true },
		});

		return aggregate._max.waitlistPosition ?? 0;
	}

	async create(
		data: Prisma.ReservationUncheckedCreateInput,
	): Promise<Reservation> {
		const result = await this.txHost.tx.reservation.create({
			data,
			include: reservationInclude,
		});

		return plainToInstance(Reservation, result);
	}

	async updateById(
		id: string,
		data: Prisma.ReservationUncheckedUpdateInput,
	): Promise<Reservation> {
		const result = await this.txHost.tx.reservation.update({
			where: { id },
			data,
			include: reservationInclude,
		});

		return plainToInstance(Reservation, result);
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

		return plainToInstance(Reservation, result);
	}

	async findNextWaitlisted(params: {
		programId: string;
		occurrenceStartAt: Date;
	}): Promise<Reservation | null> {
		const result = await this.txHost.tx.reservation.findFirst({
			where: {
				programId: params.programId,
				occurrenceStartAt: params.occurrenceStartAt,
				status: ReservationStatus.WAITLISTED,
				removedAt: null,
			},
			orderBy: [{ waitlistPosition: "asc" }, { createdAt: "asc" }],
			include: reservationInclude,
		});

		return result ? plainToInstance(Reservation, result) : null;
	}
}
