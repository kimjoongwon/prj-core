import type { PaymentStatus, Prisma } from "@cocrepo/prisma";
import type {
	CreatePaymentReferenceInput,
	CreatePaymentSubjectInput,
} from "@cocrepo/repository";

export interface CreatePaymentInput
	extends Omit<
		Prisma.PaymentUncheckedCreateInput,
		| "spaceId"
		| "totalAmount"
		| "currency"
		| "status"
		| "metadata"
		| "subjects"
		| "references"
		| "enrollments"
	> {
	spaceId?: string;
	status?: PaymentStatus;
	totalAmount?: number;
	currency?: string;
	metadata?: Prisma.InputJsonValue | null;
	subjects?: Array<
		Omit<
			CreatePaymentSubjectInput,
			"quantity" | "unitAmount" | "totalAmount" | "currency" | "metadata"
		> & {
			quantity?: number;
			unitAmount?: number;
			totalAmount?: number;
			currency?: string;
			metadata?: Prisma.InputJsonValue | null;
		}
	>;
	references?: Array<
		Omit<CreatePaymentReferenceInput, "role" | "metadata"> & {
			role?: string;
			metadata?: Prisma.InputJsonValue | null;
		}
	>;
}
