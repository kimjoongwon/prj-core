import type {
	PaymentSubject as PaymentSubjectEntity,
	PaymentSubjectType,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Payment } from "./payment.entity";
import type { Tenant } from "./tenant.entity";

export class PaymentSubject
	extends AbstractEntity
	implements PaymentSubjectEntity
{
	paymentId!: string;
	tenantId!: string;
	serviceCode!: string;
	subjectType!: PaymentSubjectType;
	subjectId!: string;
	subjectLabel!: string;
	quantity!: number;
	unitAmount!: number;
	totalAmount!: number;
	currency!: string;
	metadata!: Prisma.JsonValue | null;

	payment?: Payment;
	tenant?: Tenant;
}
