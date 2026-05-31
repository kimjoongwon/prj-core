import type { PaymentMethod } from "@cocrepo/prisma";

export interface CreateReservationCheckoutCommandParams {
	courseOfferingId: string;
	timelineId: string;
	sessionId: string;
	programId: string;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	paymentMethod: PaymentMethod;
	memo?: string | null;
}
