import type { ReservationCheckoutProgressStatus } from "@cocrepo/dto";
import type {
	CoursePass,
	Enrollment,
	Payment,
	Reservation,
} from "@cocrepo/entity";
import type { PaymentStatus } from "@cocrepo/prisma";

export interface ReservationCheckoutResult {
	status: PaymentStatus;
	payment: Payment;
	enrollment: Enrollment;
	coursePass: CoursePass;
	reservation: Reservation;
	progressSteps: Array<{
		id: string;
		label: string;
		status: ReservationCheckoutProgressStatus;
	}>;
}
