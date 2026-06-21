import type {
	Payment as PaymentEntity,
	PaymentMethod,
	PaymentStatus,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Enrollment } from "./enrollment.entity";
import type { PaymentReference } from "./payment-reference.entity";
import type { PaymentSubject } from "./payment-subject.entity";
import type { Tenant } from "./tenant.entity";
import type { User } from "./user.entity";

export class Payment extends AbstractEntity implements PaymentEntity {
	tenantId!: string;
	payerUserId!: string | null;
	title!: string;
	status!: PaymentStatus;
	method!: PaymentMethod | null;
	provider!: string | null;
	providerPaymentId!: string | null;
	providerOrderId!: string | null;
	totalAmount!: number;
	currency!: string;
	requestedAt!: Date | null;
	approvedAt!: Date | null;
	canceledAt!: Date | null;
	receiptUrl!: string | null;
	memo!: string | null;
	metadata!: Prisma.JsonValue | null;

	tenant?: Tenant;
	payer?: User | null;
	subjects?: PaymentSubject[];
	references?: PaymentReference[];
	enrollments?: Enrollment[];

	isPaid(): boolean {
		return this.status === "PAID";
	}

	isPending(): boolean {
		return this.status === "PENDING";
	}

	isCanceled(): boolean {
		return this.status === "CANCELED" || this.status === "REFUNDED";
	}
}
