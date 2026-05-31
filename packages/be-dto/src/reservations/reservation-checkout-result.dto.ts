import { ClassField, EnumField } from "@cocrepo/decorator";
import { PaymentStatus } from "@cocrepo/prisma";
import { CoursePassDto } from "../course-pass.dto";
import { EnrollmentDto } from "../enrollment.dto";
import { PaymentDto } from "../payment.dto";
import { ReservationDto } from "./reservation.dto";

import { ReservationCheckoutProgressStepDto } from "./reservation-checkout-progress-step.dto";

export class ReservationCheckoutResultDto {
	@EnumField(() => PaymentStatus, { description: "checkout 결제 상태" })
	status!: PaymentStatus;

	@ClassField(() => PaymentDto, { description: "생성된 결제 원장" })
	payment!: PaymentDto;

	@ClassField(() => EnrollmentDto, { description: "활성화된 수강 등록" })
	enrollment!: EnrollmentDto;

	@ClassField(() => CoursePassDto, { description: "발급된 수강권" })
	coursePass!: CoursePassDto;

	@ClassField(() => ReservationDto, { description: "확정 또는 대기 예약" })
	reservation!: ReservationDto;

	@ClassField(() => ReservationCheckoutProgressStepDto, {
		description: "모바일 checkout 진행 상태",
		each: true,
		isArray: true,
	})
	progressSteps!: ReservationCheckoutProgressStepDto[];
}
