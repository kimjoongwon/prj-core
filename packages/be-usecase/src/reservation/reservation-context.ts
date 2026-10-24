import { RESERVATION_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class ReservationUseCaseContext {
	constructor(
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	requireContext(): { spaceSeq: bigint; userSeq: bigint } {
		const spaceSeq = this.spaceContext.tenant?.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(RESERVATION_ERRORS.SPACE_NOT_SELECTED);
		}

		const userSeq = this.authContext.userDto?.id;
		if (!userSeq) {
			throw new UnauthorizedException(
				RESERVATION_ERRORS.USER_NOT_AUTHENTICATED,
			);
		}

		return { spaceSeq, userSeq };
	}
}
