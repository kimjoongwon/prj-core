import type { EmailVerificationStatus } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { User } from "./user.entity";

export class EmailVerification extends AbstractEntity {
	/** 공개 식별자 ULID */
	emailVerificationId!: string;

	email!: string;
	name!: string;
	nickname!: string;
	phone!: string;
	address!: string;
	spaceId!: bigint;
	passwordHash!: string;
	tokenHash!: string;
	status!: EmailVerificationStatus;
	expiresAt!: Date;
	verifiedAt!: Date | null;
	lastSentAt!: Date | null;
	sendCount!: number;
	lastSendStatus!: string | null;
	lastSendError!: string | null;
	verifiedUserId!: bigint | null;
	verifiedUser?: User | null;
}
