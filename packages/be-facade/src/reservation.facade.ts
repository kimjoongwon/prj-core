import { RESERVATION_ERRORS } from "@cocrepo/constant";
import {
	CancelReservationDto,
	CreateReservationCheckoutDto,
	CreateReservationDto,
	QueryBookingFeedDto,
	QueryMyReservationsDto,
	QueryReservationCheckoutBootstrapDto,
} from "@cocrepo/dto";
import { AuthContext, ReservationService, SpaceContext } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class ReservationFacade {
	constructor(
		private readonly reservationService: ReservationService,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	async getBookingFeed(query: QueryBookingFeedDto) {
		const { spaceId, userId } = this.requireContext();
		const skip = query.skip ?? 0;
		const take = query.take ?? 50;
		const result = await this.reservationService.getBookingFeed({
			spaceId,
			userId,
			from: query.dateFrom,
			to: query.dateTo,
			timelineId: query.timelineId,
			programId: query.programId,
			search: query.search,
			skip,
			take,
		});

		return {
			data: result.items,
			meta: {
				total: result.totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(result.totalCount / take) : 1,
			},
		};
	}

	async create(dto: CreateReservationDto) {
		const { spaceId, userId } = this.requireContext();
		return this.reservationService.create({
			spaceId,
			userId,
			input: dto,
		});
	}

	async getMine(query: QueryMyReservationsDto) {
		const { spaceId, userId } = this.requireContext();
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;
		const result = await this.reservationService.getMine({
			spaceId,
			userId,
			from: query.from,
			to: query.to,
			status: query.status,
			skip,
			take,
		});

		return {
			data: result.items,
			meta: {
				total: result.totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(result.totalCount / take) : 1,
			},
		};
	}

	cancel(reservationId: string, dto: CancelReservationDto) {
		const { spaceId, userId } = this.requireContext();
		return this.reservationService.cancel({
			spaceId,
			userId,
			reservationId,
			cancelReason: dto.cancelReason ?? null,
		});
	}

	getCheckoutBootstrap(query: QueryReservationCheckoutBootstrapDto) {
		const { spaceId, userId } = this.requireContext();
		return this.reservationService.getCheckoutBootstrap({
			spaceId,
			userId,
			occurrenceStartAt: query.occurrenceStartAt,
			programId: query.programId,
			sessionId: query.sessionId,
			timelineId: query.timelineId,
		});
	}

	createCheckout(dto: CreateReservationCheckoutDto) {
		const { spaceId, userId } = this.requireContext();
		return this.reservationService.checkout({
			spaceId,
			userId,
			courseOfferingId: dto.courseOfferingId,
			idempotencyKey: dto.idempotencyKey,
			memo: dto.memo ?? null,
			occurrenceStartAt: dto.occurrenceStartAt,
			paymentMethod: dto.paymentMethod,
			programId: dto.programId,
			sessionId: dto.sessionId,
			timelineId: dto.timelineId,
		});
	}

	private requireContext(): { spaceId: string; userId: string } {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(RESERVATION_ERRORS.SPACE_NOT_SELECTED);
		}
		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(RESERVATION_ERRORS.USER_NOT_AUTHENTICATED);
		}
		return { spaceId, userId };
	}
}
