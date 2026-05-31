import { RESERVATION_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class ReservationUseCaseContext {
	constructor(
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	requireContext(): { spaceId: string; userId: string } {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(RESERVATION_ERRORS.SPACE_NOT_SELECTED);
		}

		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(
				RESERVATION_ERRORS.USER_NOT_AUTHENTICATED,
			);
		}

		return { spaceId, userId };
	}
}
