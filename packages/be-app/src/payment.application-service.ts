import { COMMON_ERRORS } from "@cocrepo/constant";
import type {
	CreatePaymentDto,
	CreateReservationPaymentCheckoutDto,
	UpdatePaymentDto,
} from "@cocrepo/dto";
import { AuthContext, PaymentService, SpaceContext } from "@cocrepo/service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

interface PaymentCommandContext {
	spaceId: string;
	userId: string;
}

@Injectable()
export class PaymentApplicationService {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	createPayment(
		dto: CreatePaymentDto,
	): ReturnType<PaymentService["createPayment"]> {
		const context = this.requireCommandContext();
		return this.paymentService.createPayment({
			...dto,
			spaceId: context.spaceId,
		});
	}

	createReservationCheckout(
		dto: CreateReservationPaymentCheckoutDto,
	): ReturnType<PaymentService["createReservationCheckout"]> {
		const context = this.requireCommandContext();
		return this.paymentService.createReservationCheckout({
			...dto,
			spaceId: context.spaceId,
			userId: context.userId,
		});
	}

	updatePayment(
		paymentId: string,
		dto: UpdatePaymentDto,
	): ReturnType<PaymentService["updatePayment"]> {
		this.requireCommandContext();
		return this.paymentService.updatePayment(paymentId, dto);
	}

	deletePayment(
		paymentId: string,
	): ReturnType<PaymentService["deletePayment"]> {
		this.requireCommandContext();
		return this.paymentService.deletePayment(paymentId);
	}

	private requireCommandContext(): PaymentCommandContext {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(COMMON_ERRORS.SPACE_NOT_SELECTED);
		}

		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(COMMON_ERRORS.USER_NOT_FOUND);
		}

		return {
			spaceId,
			userId,
		};
	}
}
