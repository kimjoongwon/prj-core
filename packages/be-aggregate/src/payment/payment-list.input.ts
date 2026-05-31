import type {
	PaymentMethod,
	PaymentReferenceType,
	PaymentStatus,
	PaymentSubjectType,
} from "@cocrepo/prisma";

export interface PaymentListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	spaceId?: string;
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
}
