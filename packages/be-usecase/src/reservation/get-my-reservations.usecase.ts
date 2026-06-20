import { ReservationAggregate } from "@cocrepo/aggregate";
import { GetMyReservationsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReservationUseCaseContext } from "./reservation-context";

@QueryHandler(GetMyReservationsQuery)
export class GetMyReservationsUseCase
	implements IQueryHandler<GetMyReservationsQuery>
{
	constructor(
		private readonly reservationService: ReservationAggregate,
		private readonly context: ReservationUseCaseContext,
	) {}

	async execute(
		query: GetMyReservationsQuery,
	): Promise<OffsetPaginatedResponse<unknown[]>> {
		const context = this.context.requireContext();
		const params = query.params;
		const skip = params.skip ?? 0;
		const take = params.take ?? 20;
		const result = await this.reservationService.getMine({
			spaceId: context.spaceId,
			userId: context.userId,
			from: params.from,
			to: params.to,
			status: params.status,
			skip,
			take,
		});

		return buildOffsetPaginatedResponse(
			result.items,
			result.totalCount,
			skip,
			take,
		);
	}
}
