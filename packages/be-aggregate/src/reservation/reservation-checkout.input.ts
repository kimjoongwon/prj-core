import type { PaymentMethod } from "@cocrepo/prisma";
import type { ReservationCheckoutBootstrapInput } from "./reservation-checkout-bootstrap.input";

export interface ReservationCheckoutInput
	extends ReservationCheckoutBootstrapInput {
	courseOfferingId: string;
	idempotencyKey: string;
	paymentMethod: PaymentMethod;
	memo?: string | null;
}
