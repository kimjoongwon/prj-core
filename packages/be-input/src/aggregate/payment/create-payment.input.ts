import type {
	PaymentMethod,
	PaymentReferenceType,
	PaymentStatus,
	PaymentSubjectType,
} from "@cocrepo/prisma";
import type { JsonValue } from "@cocrepo/type";

export interface CreatePaymentSubjectInput {
	serviceCode?: string;
	subjectType: PaymentSubjectType;
	subjectId: string;
	subjectLabel: string;
	quantity?: number;
	unitAmount?: number;
	totalAmount?: number;
	currency?: string;
	metadata?: JsonValue | null;
}

export interface CreatePaymentReferenceInput {
	serviceCode?: string;
	referenceType: PaymentReferenceType;
	referenceId: string;
	role?: string;
	label?: string | null;
	metadata?: JsonValue | null;
}

export interface CreatePaymentInput {
	payerUserId?: string | null;
	title: string;
	status?: PaymentStatus;
	method?: PaymentMethod | null;
	provider?: string | null;
	providerPaymentId?: string | null;
	providerOrderId?: string | null;
	totalAmount?: number;
	currency?: string;
	requestedAt?: Date;
	approvedAt?: Date | null;
	canceledAt?: Date | null;
	receiptUrl?: string | null;
	memo?: string | null;
	metadata?: JsonValue | null;
	subjects?: CreatePaymentSubjectInput[];
	references?: CreatePaymentReferenceInput[];
}
