import { EnumField, StringField } from "@cocrepo/decorator";

import { ReservationCheckoutProgressStatus } from "./reservation-checkout-progress-status";

export class ReservationCheckoutProgressStepDto {
	@StringField({ description: "단계 ID" })
	id!: string;

	@StringField({ description: "단계 라벨" })
	label!: string;

	@EnumField(() => ReservationCheckoutProgressStatus, {
		description: "단계 상태",
	})
	status!: ReservationCheckoutProgressStatus;
}
