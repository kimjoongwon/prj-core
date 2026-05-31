import { ClassField, EnumField } from "@cocrepo/decorator";
import { PaymentMethod } from "@cocrepo/prisma";

import { ReservationCheckoutContextDto } from "./reservation-checkout-context.dto";
import { ReservationCheckoutOptionDto } from "./reservation-checkout-option.dto";

export class ReservationCheckoutBootstrapDto {
	@ClassField(() => ReservationCheckoutContextDto, {
		description: "예약하려는 수업 컨텍스트",
	})
	context!: ReservationCheckoutContextDto;

	@ClassField(() => ReservationCheckoutOptionDto, {
		description: "구매 가능한 과정 목록",
		each: true,
		isArray: true,
	})
	options!: ReservationCheckoutOptionDto[];

	@EnumField(() => PaymentMethod, {
		description: "지원 결제 수단 목록",
		each: true,
	})
	paymentMethods!: PaymentMethod[];
}
