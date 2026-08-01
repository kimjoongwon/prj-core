import type {
	EmailVerification as EmailVerificationEntity,
	EmailVerificationStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { User } from "./user.entity";

export class EmailVerification
	extends AbstractEntity
	implements DomainEntityModel<EmailVerificationEntity>
{
	email!: string;
	name!: string;
	nickname!: string;
	phone!: string;
	address!: string;
	spaceId!: string;
	passwordHash!: string;
	tokenHash!: string;
	status!: EmailVerificationStatus;
	expiresAt!: Date;
	verifiedAt!: Date | null;
	lastSentAt!: Date | null;
	sendCount!: number;
	lastSendStatus!: string | null;
	lastSendError!: string | null;
	verifiedUserId!: string | null;
	verifiedUser?: User | null;
}
