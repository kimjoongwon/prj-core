import type {
	PaymentMethod,
	PaymentReferenceType,
	PaymentStatus,
	PaymentSubjectType,
} from "@cocrepo/prisma";

export interface GetPaymentsQueryInput {
	search?: string;
	tenantId?: string;
	payerUserId?: string;
	status?: PaymentStatus;
	method?: PaymentMethod;
	provider?: string;
	providerOrderId?: string;
	subjectType?: PaymentSubjectType;
	subjectId?: string;
	referenceType?: PaymentReferenceType;
	referenceId?: string;
	approvedFrom?: Date;
	approvedUntil?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
