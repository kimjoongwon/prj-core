import type {
	PaymentReference as PaymentReferenceEntity,
	PaymentReferenceType,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Payment } from "./payment.entity";
import type { Tenant } from "./tenant.entity";

export class PaymentReference
	extends AbstractEntity
	implements PaymentReferenceEntity
{
	paymentId!: string;
	tenantId!: string;
	serviceCode!: string;
	referenceType!: PaymentReferenceType;
	referenceId!: string;
	role!: string;
	label!: string | null;
	metadata!: Prisma.JsonValue | null;

	payment?: Payment;
	tenant?: Tenant;
}
