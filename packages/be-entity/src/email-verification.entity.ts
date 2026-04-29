import type {
	EmailVerification as EmailVerificationEntity,
	EmailVerificationStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { User } from "./user.entity";

export class EmailVerification
	extends AbstractEntity
	implements EmailVerificationEntity
{
	email!: string;
	name!: string;
	nickname!: string;
	phone!: string;
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
